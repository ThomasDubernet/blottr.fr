# Phase 3 Implementation Patterns and Technical Learnings

## Advanced Testing Patterns Discovered

### JSON Field Testing Strategy
**Challenge**: PostgreSQL JSONB columns with AdonisJS Lucid ORM serialization
**Solution Pattern**:
```typescript
// Database Storage: Serialize objects to JSON strings
const tattoo = await Tattoo.create({
  searchKeywords: JSON.stringify(['dragon', 'japonais', 'traditionnel']),
  altText: JSON.stringify({ fr: 'Dragon japonais', en: 'Japanese dragon' })
})

// Test Assertions: Parse JSON strings back for comparison
assert.deepEqual(JSON.parse(tattoo.altText as string), expectedAltText)
assert.deepEqual(JSON.parse(tattoo.searchKeywords as string), expectedKeywords)
```

### Unique Constraint Resolution
**Challenge**: Database unique constraints in test environments with parallel execution
**Solution Pattern**:
```typescript
// Enhanced unique ID generation
const timestamp = Date.now()
const randomNum = Math.floor(Math.random() * 9999)  
const uniqueId = `${timestamp}-${randomNum}`.slice(-8)
const inseeCode = `7${uniqueId.slice(-4)}` // Keep within database constraints
```

### Complex Pivot Relationship Testing
**Challenge**: Many-to-many relationships with metadata columns requiring proper validation
**Solution Pattern**:
```typescript
await tag.related('tattoos').attach({
  [tattoo.id]: {
    relevance_score: 0.95,
    is_primary: true,
    assignment_type: 'manual',
    is_approved: true ?? false, // Use nullish coalescing, not logical OR
  }
})
```

## Database Architecture Patterns

### JSONB Query Optimization
**Challenge**: Search functionality across JSON arrays with PostgreSQL
**Solution Pattern**:
```typescript
public static search = scope((query, searchTerm: string) => {
  query.whereILike('title', `%${searchTerm}%`)
    .orWhereILike('description', `%${searchTerm}%`)
    .orWhereRaw('search_keywords::jsonb @> ?', [JSON.stringify([searchTerm])])
})
```

### Model Lifecycle Hook Enhancement
**Challenge**: Ensuring consistent default values across complex models
**Solution Pattern**:
```typescript
public static async boot() {
  super.boot()
  this.before('create', async (model) => {
    // Comprehensive default value initialization
    if (!model.status) model.status = TattooStatus.DRAFT
    if (model.viewCount === undefined) model.viewCount = 0
    if (model.engagementScore === undefined) model.engagementScore = 0
    if (model.isFeatured === undefined) model.isFeatured = false
    // ... all required defaults
  })
}
```

### Hierarchical Relationship Validation
**Challenge**: Parent-child relationships with level constraints and circular reference prevention
**Solution Pattern**:
```typescript
// Computed property for hierarchical detection
@computed()
public get isHierarchical(): boolean {
  return this.level > 0 || this.parentTagId !== null
}

// Business method for safe hierarchy creation
public async createChild(childData: Partial<Tag>): Promise<Tag> {
  return await Tag.create({
    ...childData,
    parentTagId: this.id,
    level: this.level + 1,
    category: this.category, // Inherit parent category
  })
}
```

## Business Logic Implementation Patterns

### Engagement Scoring Algorithm
**Pattern**: Logarithmic scoring with weighted metrics and caps
```typescript
private calculateEngagementScore(): number {
  const viewWeight = Math.log(this.viewCount + 1) * 0.1
  const likeWeight = this.likeCount * 0.5
  const shareWeight = this.shareCount * 1.0
  const featuredBonus = this.isFeatured ? 2 : 0
  const portfolioBonus = this.isPortfolioHighlight ? 1.5 : 0
  
  return Math.min(10, viewWeight + likeWeight + shareWeight + featuredBonus + portfolioBonus)
}
```

### Multi-language Translation System
**Pattern**: Flexible translation structure with fallback logic
```typescript
export interface TagTranslations {
  [locale: string]: TagTranslation
}

@computed()
public get displayName(): string {
  if (this.translations?.fr?.name) {
    return this.translations.fr.name
  }
  return this.name // Fallback to default
}

public async setTranslation(locale: string, data: TagTranslation): Promise<void> {
  const translations = this.translations || {}
  translations[locale] = { ...translations[locale], ...data }
  this.translations = translations
  await this.save()
}
```

### Price Range Estimation
**Pattern**: Percentage-based range calculation with currency formatting
```typescript
@computed()
public get estimatedPriceRange(): string | null {
  if (!this.priceEstimate) return null
  const base = this.priceEstimate
  const range = base * 0.3 // 30% variance
  return `${Math.round(base - range)} - ${Math.round(base + range)} ${this.priceCurrency}`
}
```

## Testing Architecture Patterns

### French Business Domain Testing
**Pattern**: Business-focused test descriptions in domain language
```typescript
test.group('Tattoo Model', () => {
  test('doit calculer correctement estimatedPriceRange', async ({ assert }) => {
    // Business logic validation in domain language
  })
  
  test('doit gérer les propriétés JSON complexes', async ({ assert }) => {
    // Complex data structure validation
  })
})
```

### Comprehensive Enum Testing
**Pattern**: Systematic validation of all business enumeration values
```typescript
test('doit tester tous les statuts de tatouage', async ({ assert }) => {
  const statuses = Object.values(TattooStatus)
  assert.isAbove(statuses.length, 0)
  assert.include(statuses, TattooStatus.DRAFT)
  assert.include(statuses, TattooStatus.PUBLISHED)
  // ... validate all enum values exist and are usable
})
```

### Helper Function Pattern for Test Data
**Pattern**: Reusable test data generation with relationship management
```typescript
async function createTestArtist(testIdentifier: string) {
  const uniqueId = generateUniqueId()
  const city = await City.create({/* unique city data */})
  const user = await User.create({/* user data linked to city */})
  const artist = await Artist.create({/* artist data linked to user */})
  
  return { city, user, artist, uniqueId }
}
```

## Performance Optimization Patterns

### Strategic Database Indexing
**Pattern**: Composite indexes for complex query patterns
```sql
-- Engagement and filtering optimization
CREATE INDEX idx_tattoos_engagement ON tattoos(status, engagement_score DESC);
CREATE INDEX idx_tattoos_featured ON tattoos(is_featured, display_order);
CREATE INDEX idx_tags_popularity ON tags(category, popularity_score DESC);
CREATE INDEX idx_pivot_primary ON tag_tattoos(tattoo_id, is_primary);
```

### Computed Property Caching
**Pattern**: Expensive calculations cached in database with recalculation triggers
```typescript
public async updateEngagement(): Promise<void> {
  this.engagementScore = this.calculateEngagementScore() // Recalculate
  await this.save() // Persist updated score
}

public async incrementLike(): Promise<void> {
  this.likeCount += 1
  this.engagementScore = this.calculateEngagementScore() // Auto-recalculate
  await this.save()
}
```

## Error Resolution Patterns

### PostgreSQL Constraint Debugging
**Pattern**: Systematic constraint violation resolution
1. **Identify**: Parse PostgreSQL error messages for constraint names
2. **Analyze**: Understand which unique/foreign key constraints are violated  
3. **Resolve**: Generate truly unique values or fix relationship logic
4. **Validate**: Test constraint resolution with multiple executions

### JSON Serialization Debugging  
**Pattern**: Systematic JSON field troubleshooting
1. **Database Level**: Ensure JSONB column types are properly configured
2. **Model Level**: Verify JSON.stringify() for storage, proper typing for retrieval
3. **Query Level**: Use raw SQL with explicit casting for complex JSON operations
4. **Test Level**: Parse JSON strings back to objects for proper assertions

## Quality Assurance Patterns

### Production-Ready Validation
**Standards Applied**:
- No TODO comments in production code
- No mock objects in integration tests  
- Comprehensive error handling for all edge cases
- Proper TypeScript typing for all interfaces
- Database transaction safety for all operations

### Continuous Quality Verification
**Automated Checks**:
```bash
npm run lint          # ESLint validation
npm run typecheck     # TypeScript compilation
npm test              # Full test suite execution
npm run build         # Production build verification
```

These patterns provide a comprehensive foundation for Phase 4 implementation and future platform evolution, ensuring production-ready quality and scalable architecture.
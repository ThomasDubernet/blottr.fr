# Architectural Patterns & Technical Learnings - Blottr.fr

## Database Architecture Patterns

### Geographic Data Integration

**Pattern**: Real-world coordinate system with Haversine calculations
**Implementation**:

- French cities with INSEE codes and GPS coordinates
- Distance calculations using Haversine formula in models
- Geographic search capabilities for salons and artists
  **Learning**: Geographic accuracy crucial for location-based services

### Role-Based System Design

**Pattern**: Numeric role enumeration for performance
**Implementation**:

- `role: 1 = client, 2 = artist` with database constraints
- Computed properties on User model (`isClient()`, `isArtist()`)
- Type-safe enum system with TypeScript
  **Learning**: Numeric roles outperform string-based systems at scale

### Verification Workflow Pattern

**Pattern**: Multi-stage verification with audit trail
**Implementation**:

- Status enum: SCRAPED → CONTACTED → PENDING → VERIFIED
- Timestamp tracking (`verified_at`, `contacted_at`)
- Verification metadata (`verified_by`, `verification_notes`)
  **Learning**: Business verification requires comprehensive state tracking

## Model Design Patterns

### Rich Domain Models

**Pattern**: Business logic embedded in models, not controllers
**Examples**:

- Salon model with operating hours parsing and geographic search
- Artist model with experience calculations and portfolio management
- User model with profile completion and role-based functionality
  **Learning**: Fat models, thin controllers principle scales better

### Relationship Management

**Pattern**: Explicit pivot tables with metadata
**Implementation**:

- `artist_salons` pivot with role, start_date, end_date
- Temporal relationships for employment history
- Multiple relationship types (owner, employee, guest)
  **Learning**: Rich pivot tables enable complex business relationships

### Geographic Search Implementation

**Pattern**: Haversine distance calculations in model scopes
**Code Example**:

```typescript
// In Salon model
public static async findNearby(lat: number, lng: number, radius: number = 50) {
  return await this.query()
    .select('*')
    .whereRaw(`
      (6371 * acos(
        cos(radians(?)) * cos(radians(latitude)) *
        cos(radians(longitude) - radians(?)) +
        sin(radians(?)) * sin(radians(latitude))
      )) <= ?
    `, [lat, lng, lat, radius])
}
```

**Learning**: Database-level geographic calculations more efficient than application-level

## Testing Architecture Patterns

### Test Isolation with Foreign Keys

**Problem**: Foreign key constraints preventing test cleanup
**Solution**: Proper test suite configuration with `testUtils.db().truncate()`
**Pattern**: Suite-level database truncation for unit tests
**Learning**: Test isolation critical for reliable test suites

### Business Logic Testing Strategy

**Pattern**: Comprehensive model testing with edge cases
**Implementation**:

- 988-line Artist test suite covering all business methods
- 616-line Salon test suite with geographic and operational logic
- Edge cases for geographic boundaries and business rules
  **Learning**: Business logic testing prevents production bugs

## AdonisJS Framework Patterns

### Migration Design

**Pattern**: Reversible migrations with proper constraints
**Best Practices**:

- UUID primary keys for distributed system readiness
- Proper foreign key constraints with cascade rules
- Index creation for performance-critical queries
- Rollback methods for all schema changes
  **Learning**: Migration safety prevents production data loss

### Seeder Architecture

**Pattern**: Realistic data with proper relationships
**Implementation**:

- Geographic accuracy with real French city data
- Business relationships respecting verification workflows
- Sample data suitable for development and demo purposes
  **Learning**: Quality seeders accelerate development and testing

## Performance Optimization Patterns

### Database Indexing Strategy

**Indexes Applied**:

- Foreign keys: `city_id`, `user_id`, `salon_id`
- Search fields: `role`, `active`, `verification_status`
- Geographic: `latitude`, `longitude` composite index
- Performance: `priority`, `featured` for ordering
  **Learning**: Strategic indexing crucial for query performance

### Model Optimization

**Pattern**: Eager loading and relationship optimization
**Implementation**:

- Relationship definitions with proper loading strategies
- Computed properties for derived data
- Query scopes for common business operations
  **Learning**: ORM optimization prevents N+1 query problems

## Code Quality Patterns

### TypeScript Integration

**Pattern**: Full type safety with business domain modeling
**Implementation**:

- Enum types for roles, statuses, and business categories
- Interface definitions for complex data structures
- Type-safe model relationships and computed properties
  **Learning**: TypeScript prevents runtime errors in business logic

### Naming Conventions

**Pattern**: Descriptive, business-domain aligned naming
**Examples**:

- `isEmailVerified()` vs `emailVerified`
- `findNearby()` vs `findByLocation()`
- `verificationStatus` vs `status`
  **Learning**: Clear naming reduces cognitive load and improves maintainability

## Session Management Learnings

### Memory Persistence Strategy

**Pattern**: Hierarchical project memory with checkpoints
**Implementation**:

- Session checkpoints for major milestone preservation
- Project progress tracking across multiple sessions
- Architectural decision recording for future reference
  **Learning**: Structured memory management enables complex project continuity

### Git Workflow Optimization

**Pattern**: Conventional commits with breaking change tracking
**Implementation**:

- Semantic versioning through commit messages
- Breaking change documentation for migration planning
- Comprehensive commit bodies with technical details
  **Learning**: Structured commits essential for project maintainability

These patterns form the foundation for Phase 3 and Phase 4 implementation, ensuring architectural consistency and scalability.

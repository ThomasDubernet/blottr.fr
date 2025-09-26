# Testing Patterns & Solutions Archive

**Last Updated**: 2025-09-26
**Context**: Phase 1 & 2 Unit Test Resolution
**Status**: Production Patterns Validated

## 🧪 **AdonisJS Testing Best Practices**

### **Model Testing Patterns**

#### **Default Value Testing**

```typescript
test('doit créer avec des valeurs par défaut', async ({ assert }) => {
  const model = await Model.create({ requiredField: 'value' })

  // Test all default values are properly set
  assert.equal(model.isActive, true)
  assert.equal(model.totalCount, 0)
  assert.equal(model.status, 'pending')
})
```

#### **Relationship Testing**

```typescript
test('doit gérer les relations avec pivot', async ({ assert }) => {
  const artist = await Artist.create(artistData)
  const salon = await Salon.create(salonData)

  // Test pivot operations
  await salon.addArtist(artist.id, 'primary')
  await salon.related('artists').query().wherePivot('is_active', true)

  assert.lengthOf(activeRelations, 1)
})
```

#### **JSON Column Testing**

```typescript
test('doit gérer les propriétés JSON correctement', async ({ assert }) => {
  const model = await Model.create({
    jsonField: ['value1', 'value2'],
    metadata: { key: 'value' },
  })

  // Test serialization/deserialization
  assert.isArray(model.jsonField)
  assert.equal(model.metadata.key, 'value')
})
```

### **Database Query Testing**

#### **PostgreSQL JSONB Testing**

```typescript
test('doit rechercher dans les champs JSONB', async ({ assert }) => {
  await Model.create({ tags: ['tag1', 'tag2'] })

  // Test JSONB containment queries
  const results = await Model.findByTags(['tag1'])
  assert.lengthOf(results, 1)
})
```

#### **Raw Query Testing**

```typescript
test('doit exécuter des requêtes SQL brutes', async ({ assert }) => {
  const results = await Database.rawQuery('SELECT * FROM table WHERE jsonb_field @> ?', [
    JSON.stringify(['value']),
  ])

  assert.isArray(results)
})
```

### **Unicode & Localization Testing**

#### **Currency Formatting Testing**

```typescript
test('doit formater les prix en français', async ({ assert }) => {
  const model = await Model.create({ minPrice: 100, maxPrice: 500 })

  // Use content inclusion for unicode-safe assertions
  assert.include(model.priceRange!, '100,00')
  assert.include(model.priceRange!, '€')
  assert.include(model.priceRange!, 'À partir de')
})
```

#### **Locale-Safe Assertions**

```typescript
// ❌ Fragile: Exact matching with unicode
assert.equal(formatted, 'À partir de 100,00 €')

// ✅ Robust: Content inclusion
assert.include(formatted, '100,00')
assert.include(formatted, '€')
```

## 🔍 **Debugging Methodologies**

### **Systematic Test Failure Resolution**

#### **Step 1: Isolate Failures**

```bash
# Run specific test suites
npm test -- --filter "*artist.spec.ts"
npm test -- --filter "*salon.spec.ts"
```

#### **Step 2: Analyze Error Messages**

- Extract exact failure reasons from stack traces
- Identify patterns across multiple failures
- Separate database issues from business logic issues

#### **Step 3: Layer-by-Layer Debugging**

1. **Database Layer**: Test raw queries and constraints
2. **Model Layer**: Test ORM operations and relationships
3. **Business Logic**: Test computed properties and methods
4. **Test Layer**: Verify assertions and test data

#### **Step 4: Incremental Validation**

- Apply one fix at a time
- Run tests after each change
- Verify no regressions introduced

### **PostgreSQL JSONB Debugging**

#### **Query Analysis**

```sql
-- Test JSONB operations directly in PostgreSQL
EXPLAIN ANALYZE SELECT * FROM artists WHERE art_styles::jsonb @> '["realisme"]';
```

#### **Parameter Binding Debug**

```typescript
// Debug parameter binding issues
console.log('Query:', query.toQuery())
console.log('Bindings:', query.bindings)
```

#### **Operator Selection Guide**

- `@>`: Contains (use for exact array element matching)
- `?|`: Overlap (complex parameter binding, avoid if possible)
- `->`: Extract JSON field (use for nested access)
- `->>`: Extract JSON field as text (use for string comparisons)

### **ORM Relationship Debugging**

#### **Type Inspection**

```typescript
// Debug relationship types
const relation = model.related('relationName')
console.log('Relation type:', typeof relation)
console.log('Available methods:', Object.getOwnPropertyNames(relation))
```

#### **Query Builder Analysis**

```typescript
// Debug generated SQL
const query = model.related('relation').query()
console.log('SQL:', query.toQuery())
```

## ⚡ **Performance Optimization Patterns**

### **Database Optimization**

- Use proper indexes on JSONB columns: `CREATE INDEX ON table USING GIN (jsonb_column)`
- Avoid N+1 queries with `preload()` in Lucid
- Use `select()` to limit columns returned
- Optimize pivot queries with proper WHERE clauses

### **Test Performance**

- Use `group.each.setup()` for proper test isolation
- Clean up test data between tests
- Use database transactions for faster test runs
- Mock external dependencies in unit tests

## 🚨 **Common Pitfalls & Solutions**

### **AdonisJS Specific**

1. **Default Values**: Never use TypeScript defaults, always use beforeCreate hooks
2. **Relationships**: Cast to `any` when accessing advanced ORM methods
3. **JSON Columns**: Always handle parsing errors gracefully
4. **Migrations**: Test both up and down migrations

### **PostgreSQL JSONB**

1. **Parameter Binding**: Use simple operators to avoid binding complexity
2. **Index Usage**: Create GIN indexes for JSONB queries
3. **Array Operations**: Prefer containment (`@>`) over overlap (`?|`)
4. **Type Casting**: Always cast to `::jsonb` in raw queries

### **Testing Anti-Patterns**

1. **Exact Unicode Matching**: Use content inclusion instead
2. **Shared Test State**: Always clean up between tests
3. **Hard-coded Values**: Use factories for dynamic test data
4. **Missing Error Cases**: Test both success and failure scenarios

## ✅ **Quality Checklist**

### **Before Committing Tests**

- [ ] All tests pass (100% success rate)
- [ ] TypeScript compilation clean
- [ ] No console.log statements left in code
- [ ] Test data properly cleaned up
- [ ] Edge cases covered (null, empty, invalid inputs)
- [ ] Performance considerations addressed
- [ ] Error handling tested
- [ ] Documentation updated

### **Pattern Validation**

- [ ] Default values use beforeCreate hooks
- [ ] JSONB queries use appropriate operators
- [ ] Unicode assertions use inclusion patterns
- [ ] Relationships properly typed and tested
- [ ] Database constraints validated
- [ ] Business logic separated from persistence logic

This archive serves as the foundation for all future testing efforts in the Blottr.fr project.

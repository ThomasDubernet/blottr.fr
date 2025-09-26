# Phase 2: Business Core Implementation Workflow

## Overview

**Duration**: Weeks 4-6 (78 development hours)
**Objective**: Implement core business entities for tattoo platform ecosystem

## Target Tables

- **shops** (business entity foundation)
- **salons** (service location entities)
- **artists** (service provider entities)
- **artist_salons** (many-to-many relationship)

## Phase 2 Dependencies from Phase 1

✅ Enhanced User model with roles
✅ City system for geographic locations
✅ Role-based authentication system

## Phase 2 Task Breakdown

### Week 4: Business Entity Foundation (26 hours)

#### 🔍 Domain Analysis & Design (8 hours)

- [ ] **Business model research** (3h)
  - Tattoo industry business structures
  - Shop vs Salon distinction analysis
  - Artist employment/freelance patterns
- [ ] **Entity relationship design** (3h)
  - Shop-to-Salon relationships
  - Artist-to-Salon many-to-many mapping
  - User role integration (owner, artist, manager)
- [ ] **Data model validation** (2h)
  - Business logic validation with stakeholders
  - Scalability analysis for entity growth
  - Performance considerations for complex queries

#### 🏗️ Database Architecture (10 hours)

- [ ] **Shops table design** (3h)
  ```typescript
  // Business entity: name, description, owner_id, city_id
  // Business info: website, social_media, contact_info
  // Status: active, verified, featured
  ```
- [ ] **Salons table design** (3h)
  ```typescript
  // Physical locations: name, address, shop_id, city_id
  // Operational: hours, capacity, amenities
  // Coordinates for mapping/search functionality
  ```
- [ ] **Artists table design** (2h)
  ```typescript
  // Professional info: user_id, specialties, experience
  // Portfolio: bio, style_description, pricing_info
  // Status: active, available, verified
  ```
- [ ] **Artist-Salons pivot design** (2h)
  ```typescript
  // Relationship: artist_id, salon_id, role, status
  // Temporal: start_date, end_date, is_primary
  // Terms: commission_rate, schedule_preferences
  ```

#### 📋 Service Layer Planning (8 hours)

- [ ] **Business logic services design** (4h)
  - Shop management service
  - Salon operations service
  - Artist profile service
  - Business relationship service
- [ ] **API endpoint planning** (2h)
  - RESTful resource design
  - Search and filtering endpoints
  - Business relationship management endpoints
- [ ] **Validation rules design** (2h)
  - Business entity validation rules
  - Relationship constraint validation
  - Role-based access validation

### Week 5: Core Implementation (26 hours)

#### 🗄️ Database Implementation (10 hours)

- [ ] **Migration development** (6h)
  ```typescript
  // Create shops migration with proper indexes
  // Create salons migration with geographic indexes
  // Create artists migration with search optimization
  // Create artist_salons pivot with relationship constraints
  ```
- [ ] **Migration testing** (4h)
  - Up/down migration validation
  - Foreign key constraint testing
  - Index performance validation

#### 🏛️ Model Layer Development (8 hours)

- [ ] **Shop model implementation** (2.5h)
  ```typescript
  // Relationships: belongsTo User (owner), hasMany Salons, city
  // Methods: getActiveShops(), searchByLocation()
  // Computed: isVerified, totalSalons, activeArtists
  ```
- [ ] **Salon model implementation** (2.5h)
  ```typescript
  // Relationships: belongsTo Shop, City, manyToMany Artists
  // Methods: getAvailableArtists(), searchNearby()
  // Computed: isOperational, currentCapacity
  ```
- [ ] **Artist model implementation** (3h)
  ```typescript
  // Relationships: belongsTo User, manyToMany Salons
  // Methods: getPortfolio(), getAvailability(), searchByStyle()
  // Computed: isAvailable, primarySalon, experienceLevel
  ```

#### 🔧 Service Layer Implementation (8 hours)

- [ ] **Business management services** (4h)
  - Shop creation and management
  - Salon operations and scheduling
  - Artist onboarding and profile management
- [ ] **Relationship management services** (4h)
  - Artist-salon relationship CRUD
  - Business ownership transfers
  - Multi-location management

### Week 6: Integration & Advanced Features (26 hours)

#### 🌐 API Layer Development (10 hours)

- [ ] **Shop management endpoints** (3h)
  ```typescript
  // GET /api/shops - List with filtering
  // POST/PUT/DELETE /api/shops/:id - CRUD operations
  // GET /api/shops/:id/salons - Shop's salons
  ```
- [ ] **Salon management endpoints** (3h)
  ```typescript
  // GET /api/salons - Search with geographic filtering
  // POST/PUT/DELETE /api/salons/:id - CRUD operations
  // GET /api/salons/:id/artists - Salon's artists
  ```
- [ ] **Artist management endpoints** (4h)
  ```typescript
  // GET /api/artists - Search by style, location, availability
  // POST/PUT/DELETE /api/artists/:id - Profile management
  // POST/DELETE /api/artists/:id/salons - Relationship management
  ```

#### 🎨 Frontend Integration (8 hours)

- [ ] **Business entity components** (4h)
  - Shop profile card and detail views
  - Salon location and info displays
  - Artist profile cards with portfolio preview
- [ ] **Management interfaces** (4h)
  - Shop owner dashboard
  - Salon management interface
  - Artist profile editor

#### 🧪 Comprehensive Testing (8 hours)

- [ ] **Unit test suite** (4h)
  ```typescript
  // Business logic testing for all models
  // Service layer functionality testing
  // Validation rule testing
  ```
- [ ] **Integration test suite** (4h)
  ```typescript
  // API endpoint testing
  // Database relationship testing
  // Role-based access control testing
  ```

## Critical Business Logic

### Business Rules Implementation

1. **Shop Ownership**: Only verified users can own shops
2. **Salon Management**: Shop owners can create/manage their salons
3. **Artist Association**: Artists can work at multiple salons
4. **Geographic Constraints**: All entities must have valid city associations
5. **Status Management**: Inactive entities don't appear in public searches

### Complex Queries Optimization

```typescript
// Most complex queries to optimize:
// 1. Artists near location with availability
// 2. Salons with specific services and artists
// 3. Shops with highest-rated artists
// 4. Multi-criteria search (location + style + availability)
```

## Quality Gates

### Phase 2 Completion Criteria

- ✅ **Data Integrity**: All relationships work correctly
- ✅ **Performance**: Complex queries <300ms
- ✅ **Business Logic**: All business rules enforced
- ✅ **Search Functionality**: Geographic and text search working
- ✅ **Role Integration**: Proper access control throughout

### Validation Checkpoints

1. **Week 4 End**: Architecture approved, migrations designed
2. **Week 5 End**: Core models working, basic CRUD complete
3. **Week 6 End**: Full API working, frontend integrated

## Risk Mitigation

### 🔴 Critical Risks

1. **Complex Relationships**: Artist-salon many-to-many complexity
   - **Mitigation**: Thorough testing of relationship operations
   - **Rollback**: Ability to disable relationship features
2. **Performance Issues**: N+1 queries on complex searches
   - **Mitigation**: Eager loading strategy, query optimization
   - **Monitoring**: Performance benchmarks for all search operations

### 🟡 Medium Risks

1. **Business Logic Complexity**: Over-complicated business rules
   - **Mitigation**: Start with MVP rules, iterate based on usage
2. **Geographic Search Performance**: Location-based queries slowness
   - **Mitigation**: Proper geographic indexing, query optimization

## Parallel Development Streams

### Backend Development

```
Week 4: Database Design || Service Layer Planning
Week 5: Model Implementation || Service Implementation
Week 6: API Development || Performance Optimization
```

### Frontend Development

```
Week 4: Component Planning || UI Design
Week 5: Basic Components || Integration Preparation
Week 6: Management Interfaces || User Experience Polish
```

### Testing Development

```
Week 4: Test Strategy || Test Environment Setup
Week 5: Unit Tests || Model Testing
Week 6: Integration Tests || End-to-End Testing
```

## Performance Targets

### Database Performance

- **Simple Queries**: <50ms (single entity lookups)
- **Complex Searches**: <300ms (multi-criteria with joins)
- **Geographic Queries**: <200ms (location-based searches)
- **Relationship Queries**: <150ms (artist-salon associations)

### API Performance

- **CRUD Operations**: <100ms response time
- **Search Endpoints**: <400ms with full results
- **List Endpoints**: <200ms with pagination

## Phase 2 → Phase 3 Handoff

### Deliverables for Phase 3

1. **Business Entity System**: Shops, salons, and artists fully operational
2. **Geographic Search**: Location-based business discovery
3. **Relationship Management**: Artist-salon associations working
4. **Role Integration**: Business owners can manage their entities

### Dependencies Resolved for Phase 3

- Business entities ready for portfolio/tattoo associations
- Artist system ready for portfolio content management
- Salon system ready for booking and appointment features
- Search foundation ready for content-based filtering

---

_Next: Phase 3 Content System workflow design_

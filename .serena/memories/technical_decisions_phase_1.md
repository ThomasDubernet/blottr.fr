# Technical Decisions - Phase 1 Authentication System

## Architecture Decisions Made

### 1. User Role System Design
**Decision**: Integer-based roles (client=1, artist=2)
**Rationale**: 
- Performance advantage over string-based roles
- Easy to extend (admin=3, salon_owner=4, etc.)
- Database indexes work efficiently with integers
- Follows AdonisJS conventions for enum-like fields

**Alternative Considered**: String-based roles ('client', 'artist')
**Why Rejected**: Slower query performance, larger storage footprint

### 2. Geographic Data Structure
**Decision**: Dedicated cities table with full French geographic data
**Rationale**:
- SEO-friendly slugs for location pages
- INSEE codes for official French administrative data
- GPS coordinates for proximity calculations
- Population data for search result ordering
- Future support for city-specific features

**Implementation Details**:
- UUID primary keys for future scalability
- Haversine formula for distance calculations
- Performance indexes on coordinates and administrative divisions
- Real data from French geographic databases

### 3. Migration Strategy
**Decision**: Separate migrations for each concern with proper dependencies
**Rationale**:
- Easier rollback procedures
- Clear separation of concerns
- Foreign key constraints added after table creation
- Reduces risk during deployment

**Pattern Established**:
1. Create tables without constraints
2. Seed initial data
3. Add foreign key relationships
4. Add performance indexes

### 4. Model Business Logic Placement
**Decision**: Rich domain models with business methods
**Rationale**:
- Encapsulates business rules at model level
- Computed properties for derived data
- Geographic calculations as model methods
- Follows Active Record pattern conventions

**Examples Implemented**:
- `user.isClient()` / `user.isArtist()` computed properties
- `user.age` computed from birth_date
- `user.profileCompletion()` business logic
- `city.distanceTo(otherCity)` geographic calculation

### 5. Testing Architecture
**Decision**: Comprehensive unit tests for all business logic
**Rationale**:
- Validates geographic calculations
- Tests role-based functionality
- Verifies relationship integrity
- Ensures proper validation rules

**Coverage Areas**:
- Model creation and validation
- Business method logic
- Geographic distance calculations
- Database relationships
- Error handling scenarios

## Performance Considerations

### Database Indexes Strategy
```sql
-- Role-based queries
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_role_active ON users(role, last_login_at);

-- Geographic queries  
CREATE INDEX idx_cities_country_region ON cities(country, region);
CREATE INDEX idx_cities_coordinates ON cities(latitude, longitude);
CREATE INDEX idx_users_city ON users(preferred_city_id);

-- Search optimization
CREATE INDEX idx_cities_name ON cities(name);
CREATE INDEX idx_cities_slug ON cities(slug);
```

### Query Optimization Patterns
- Use computed properties instead of JOIN queries where possible
- Leverage database functions for geographic calculations
- Implement pagination for large result sets
- Cache frequently accessed geographic data

## Security Considerations

### Data Protection
- Password hashing maintained with existing system
- Email/phone verification flags for progressive disclosure
- Role-based access control foundation established
- UUID usage for non-sequential identifiers

### Validation Rules
- Email format validation at database and model level
- Phone number format validation for French numbers
- Required field validation with proper error messages
- Geographic coordinate validation ranges

## Scalability Decisions

### Future-Proofing
- UUID primary keys for distributed systems
- Generic foreign key structure for multi-tenancy
- Extensible role system for new user types
- Geographic data structure supports multiple countries

### Performance Scaling
- Database indexes optimized for expected query patterns
- Geographic calculations can be moved to database functions
- City statistics computed and cached rather than calculated
- Ready for read replica configurations

## Development Workflow Established

### Migration Management
- All migrations include proper `down()` methods
- Foreign keys added separately for safer deployments  
- Seeders run independently and idempotently
- Migration rollback procedures tested

### Testing Standards
- Unit tests for all business logic
- Database relationship testing
- Geographic calculation verification
- Error scenario coverage
- French language test descriptions for business context

### Code Quality Standards
- TypeScript interfaces for all data structures
- Proper error handling with custom exceptions
- AdonisJS conventions followed consistently
- Business logic encapsulated in models
- Clear separation between data access and business rules

These technical decisions provide a solid foundation for Phase 2 development while maintaining flexibility for future platform evolution.
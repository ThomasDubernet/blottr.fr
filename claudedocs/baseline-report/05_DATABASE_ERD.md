# 05 - Database ERD

## SGBD & Configuration

**PostgreSQL** (version détectée via migrations Lucid)
- **Connection:** Via `config/database.ts`
- **ORM:** Lucid ORM 21.6.1 (AdonisJS)
- **Migrations:** 14 fichiers (chronological order)
- **Seeders:** 1 seeder (cities)

```typescript
// config/database.ts (simplifié)
{
  connection: 'pg',
  client: 'pg',
  host: env.get('DB_HOST', '127.0.0.1'),
  port: env.get('DB_PORT', 5432),
  database: env.get('DB_DATABASE', 'app'),
  user: env.get('DB_USER', 'root'),
  password: env.get('DB_PASSWORD', 'root'),
}
```

---

## Schéma Complet (14 Tables)

### Entity Relationship Diagram

```mermaid
erDiagram
    users ||--o| artists : "can_be"
    users }o--|| cities : "lives_in"

    artists ||--o{ tattoos : "creates"
    artists }o--o{ salons : "works_at (via artist_salons)"
    artists }o--|| cities : "based_in"
    artists }o--o| salons : "primary_salon"

    salons }o--|| cities : "located_in"

    tattoos }o--o{ tags : "tagged_with (via tag_tattoos)"

    contact_inquiries }o--o| artists : "targets"
    contact_inquiries }o--o| tattoos : "references"

    auth_access_tokens }o--|| users : "belongs_to"

    rate_limits }|--|| users : "tracks"

    users {
        int id PK
        string email UK
        string password
        string full_name
        int role "1=client, 2=artist"
        string phone
        text bio
        string avatar_url
        date birth_date
        enum gender
        int city_id FK
        string address
        string postal_code
        decimal latitude
        decimal longitude
        bool email_verified
        timestamp email_verified_at
        bool phone_verified
        timestamp phone_verified_at
        bool is_active
        timestamp last_login_at
        timestamp created_at
        timestamp updated_at
    }

    cities {
        int id PK
        string name
        string slug UK
        string postal_code
        string insee_code UK
        decimal latitude
        decimal longitude
        int population
        decimal area
        string department_code
        string department_name
        string region_code
        string region_name
        text description
        string meta_title
        text meta_description
        json seo_keywords
        bool is_active
        bool is_featured
        int priority
        timestamp created_at
        timestamp updated_at
    }

    artists {
        uuid id PK
        int user_id FK_UK
        string stage_name
        string slug UK
        text bio
        string short_bio
        text specialty
        int years_experience
        date started_tattooing_at
        enum experience_level
        json art_styles
        int city_id FK
        uuid primary_salon_id FK
        bool accepts_bookings
        bool appointment_only
        decimal min_price
        decimal max_price
        string currency
        json availability
        json portfolio_images
        string instagram_handle
        string instagram_url
        string website
        json social_links
        enum verification_status
        timestamp verified_at
        string verified_by
        text verification_notes
        json verification_documents
        bool has_health_certificate
        bool has_professional_insurance
        date health_certificate_expires_at
        text certifications
        bool is_active
        bool is_featured
        bool is_accepting_new_clients
        int priority
        decimal average_rating
        int total_reviews
        int total_tattoos
        int profile_views
        timestamp last_activity_at
        string meta_title
        text meta_description
        json seo_keywords
        timestamp created_at
        timestamp updated_at
    }

    salons {
        uuid id PK
        string name
        string slug UK
        text description
        string short_description
        string email
        string phone
        string website
        int city_id FK
        string address
        string postal_code
        decimal latitude
        decimal longitude
        json opening_hours
        json services
        decimal price_range_min
        decimal price_range_max
        string currency
        string instagram_handle
        string facebook_url
        string tiktok_handle
        json gallery_images
        enum verification_status
        timestamp verified_at
        string verified_by
        text verification_notes
        bool is_active
        bool is_featured
        bool accepts_walk_ins
        bool appointment_required
        int priority
        string meta_title
        text meta_description
        json seo_keywords
        decimal average_rating
        int total_reviews
        int total_artists
        timestamp last_activity_at
        timestamp created_at
        timestamp updated_at
    }

    artist_salons {
        int id PK
        uuid artist_id FK
        uuid salon_id FK
        enum relationship_type "primary|guest|freelance"
        bool is_active
        json schedule
        decimal hourly_rate
        decimal commission_rate
        date started_working_at
        date ended_working_at
        text notes
        bool can_book_appointments
        bool can_manage_schedule
        bool has_salon_key
        timestamp created_at
        timestamp updated_at
    }

    tattoos {
        uuid id PK
        uuid artist_id FK
        string title
        text description
        string slug UK
        string original_filename
        string storage_path
        json image_variants
        string primary_color
        int file_size
        json dimensions
        string content_type
        string content_hash
        enum tattoo_style
        enum body_placement
        enum size_category
        enum color_type
        int session_count
        decimal estimated_hours
        enum status "draft|pending_review|published|archived"
        bool is_featured
        bool is_portfolio_highlight
        int display_order
        int view_count
        int like_count
        int share_count
        decimal engagement_score
        bool allows_inquiries
        bool shows_pricing
        decimal price_estimate
        string price_currency
        json alt_text
        json search_keywords
        string meta_title
        text meta_description
        timestamp created_at
        timestamp updated_at
        timestamp published_at
    }

    tags {
        int id PK
        string name UK
        string slug UK
        text description
        enum category
        int parent_tag_id FK
        int level
        string color_code
        string icon_name
        int display_order
        int usage_count
        bool is_featured
        bool is_trending
        decimal popularity_score
        bool requires_approval
        bool is_approved
        string created_by
        string approved_by
        json translations
        timestamp created_at
        timestamp updated_at
    }

    tag_tattoos {
        int id PK
        int tag_id FK
        uuid tattoo_id FK
        decimal relevance_score
        bool is_primary
        enum assignment_type "manual|auto|ai_suggested"
        bool is_approved
        string approved_by
        text approval_notes
        timestamp created_at
        timestamp updated_at
    }

    contact_inquiries {
        uuid id PK
        string full_name
        string email
        string phone
        string subject
        text message
        enum project_type
        string budget
        string preferred_date
        string location
        json tattoo_styles
        string size
        string placement
        bool has_existing_tattoos
        json reference_images
        uuid artist_id FK
        uuid tattoo_id FK
        enum status
        enum source
        int priority
        bool is_read
        bool is_starred
        string ip_address
        string user_agent
        json metadata
        timestamp first_replied_at
        timestamp last_replied_at
        int replies_count
        timestamp created_at
        timestamp updated_at
    }

    auth_access_tokens {
        int id PK
        int tokenable_id FK
        string type
        string name
        string hash UK
        text abilities
        timestamp created_at
        timestamp updated_at
        timestamp last_used_at
        timestamp expires_at
    }

    rate_limits {
        int id PK
        string key UK
        int points
        timestamp expire_at
        timestamp created_at
        timestamp updated_at
    }
```

---

## Tables Détaillées

### Core Tables

#### 1. **users** (Utilisateurs)
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR,
  email VARCHAR(254) NOT NULL UNIQUE,
  password VARCHAR NOT NULL,

  -- Role & Profile
  role INTEGER NOT NULL DEFAULT 1 CHECK (role IN (1, 2)), -- 1=client, 2=artist
  phone VARCHAR(20),
  bio TEXT,
  avatar_url VARCHAR,
  birth_date DATE,
  gender ENUM('male', 'female', 'other', 'prefer_not_to_say'),

  -- Location
  city_id INTEGER UNSIGNED,
  address VARCHAR,
  postal_code VARCHAR(10),
  latitude DECIMAL(10,8) CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11,8) CHECK (longitude >= -180 AND longitude <= 180),

  -- Verification
  email_verified BOOLEAN NOT NULL DEFAULT false,
  email_verified_at TIMESTAMP,
  phone_verified BOOLEAN NOT NULL DEFAULT false,
  phone_verified_at TIMESTAMP,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_login_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP,

  FOREIGN KEY (city_id) REFERENCES cities(id)
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_city_id ON users(city_id);
CREATE INDEX idx_users_is_active ON users(is_active);
CREATE INDEX idx_users_email_verified ON users(email_verified);
CREATE INDEX idx_users_lat_lng ON users(latitude, longitude);
```

**Business Logic:**
- Role 1 (client) par défaut
- Role 2 (artist) → doit avoir record `artists`
- Email verification obligatoire pour certaines features
- Soft delete via `is_active=false`

---

#### 2. **cities** (Villes françaises)
```sql
CREATE TABLE cities (
  id SERIAL PRIMARY KEY,

  -- Identity
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  postal_code VARCHAR(10) NOT NULL,
  insee_code VARCHAR(10) NOT NULL UNIQUE,

  -- Geography
  latitude DECIMAL(10,8) NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
  longitude DECIMAL(11,8) NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
  population INTEGER CHECK (population >= 0),
  area DECIMAL(8,2) CHECK (area >= 0), -- km²

  -- Administrative
  department_code VARCHAR(3) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  region_code VARCHAR(2) NOT NULL,
  region_name VARCHAR(100) NOT NULL,

  -- SEO
  description TEXT,
  meta_title VARCHAR,
  meta_description TEXT,
  seo_keywords JSONB,

  -- Visibility
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  priority INTEGER NOT NULL DEFAULT 100 CHECK (priority >= 0),

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP
);

CREATE INDEX idx_cities_slug ON cities(slug);
CREATE INDEX idx_cities_postal_code ON cities(postal_code);
CREATE INDEX idx_cities_insee_code ON cities(insee_code);
CREATE INDEX idx_cities_dept ON cities(department_code);
CREATE INDEX idx_cities_region ON cities(region_code);
CREATE INDEX idx_cities_active ON cities(is_active);
CREATE INDEX idx_cities_featured ON cities(is_featured);
CREATE INDEX idx_cities_priority ON cities(priority);
CREATE INDEX idx_cities_lat_lng ON cities(latitude, longitude);
CREATE INDEX idx_cities_name ON cities(name);
```

**Data Source:** INSEE référentiel officiel
**Seeding:** 1 seeder (1_city_seeder.ts) - villes françaises principales

---

#### 3. **artists** (Tatoueurs)
```sql
CREATE TABLE artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User link (one-to-one)
  user_id INTEGER UNSIGNED NOT NULL UNIQUE,

  -- Professional identity
  stage_name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  bio TEXT,
  short_bio VARCHAR(200),
  specialty TEXT,

  -- Experience
  years_experience INTEGER,
  started_tattooing_at DATE,
  experience_level ENUM('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
  art_styles JSONB, -- ["realistic", "traditional", ...]

  -- Location & Salon
  city_id INTEGER UNSIGNED NOT NULL,
  primary_salon_id UUID,

  -- Booking & Pricing
  accepts_bookings BOOLEAN DEFAULT true,
  appointment_only BOOLEAN DEFAULT true,
  min_price DECIMAL(8,2),
  max_price DECIMAL(8,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  availability JSONB,

  -- Portfolio & Social
  portfolio_images JSONB,
  instagram_handle VARCHAR,
  instagram_url VARCHAR,
  website VARCHAR,
  social_links JSONB,

  -- Verification
  verification_status ENUM('unverified','scraped','contacted','onboarding','verified') DEFAULT 'unverified',
  verified_at TIMESTAMP,
  verified_by VARCHAR,
  verification_notes TEXT,
  verification_documents JSONB,

  -- Credentials
  has_health_certificate BOOLEAN DEFAULT false,
  has_professional_insurance BOOLEAN DEFAULT false,
  health_certificate_expires_at DATE,
  certifications TEXT,

  -- Visibility & Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  is_accepting_new_clients BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,

  -- Metrics
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  total_tattoos INTEGER DEFAULT 0,
  profile_views INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,

  -- SEO
  meta_title VARCHAR,
  meta_description TEXT,
  seo_keywords JSONB,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
  FOREIGN KEY (primary_salon_id) REFERENCES salons(id) ON DELETE SET NULL
);

CREATE INDEX idx_artists_slug ON artists(slug);
CREATE INDEX idx_artists_user_id ON artists(user_id);
CREATE INDEX idx_artists_city_id ON artists(city_id);
CREATE INDEX idx_artists_primary_salon ON artists(primary_salon_id);
CREATE INDEX idx_artists_city_active ON artists(city_id, is_active);
CREATE INDEX idx_artists_verification_active ON artists(verification_status, is_active);
CREATE INDEX idx_artists_featured_priority ON artists(is_active, is_featured, priority);
CREATE INDEX idx_artists_accepting_clients ON artists(is_accepting_new_clients, is_active);
```

---

#### 4. **salons** (Salons de tatouage)
```sql
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  name VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,
  short_description VARCHAR(200),

  -- Contact
  email VARCHAR,
  phone VARCHAR(20),
  website VARCHAR,

  -- Location
  city_id INTEGER UNSIGNED NOT NULL,
  address VARCHAR NOT NULL,
  postal_code VARCHAR(10) NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),

  -- Business info
  opening_hours JSONB,
  services JSONB,
  price_range_min DECIMAL(8,2),
  price_range_max DECIMAL(8,2),
  currency VARCHAR(3) DEFAULT 'EUR',

  -- Social
  instagram_handle VARCHAR,
  facebook_url VARCHAR,
  tiktok_handle VARCHAR,
  gallery_images JSONB,

  -- Verification
  verification_status ENUM('unverified','scraped','contacted','onboarding','verified') DEFAULT 'unverified',
  verified_at TIMESTAMP,
  verified_by VARCHAR,
  verification_notes TEXT,

  -- Visibility
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  accepts_walk_ins BOOLEAN DEFAULT false,
  appointment_required BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,

  -- SEO
  meta_title VARCHAR,
  meta_description TEXT,
  seo_keywords JSONB,

  -- Metrics
  average_rating DECIMAL(3,2),
  total_reviews INTEGER DEFAULT 0,
  total_artists INTEGER DEFAULT 0,
  last_activity_at TIMESTAMP,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,

  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT
);

CREATE INDEX idx_salons_slug ON salons(slug);
CREATE INDEX idx_salons_city_id ON salons(city_id);
CREATE INDEX idx_salons_city_active ON salons(city_id, is_active);
CREATE INDEX idx_salons_verification_active ON salons(verification_status, is_active);
CREATE INDEX idx_salons_featured_priority ON salons(is_active, is_featured, priority);
CREATE INDEX idx_salons_lat_lng ON salons(latitude, longitude);
```

---

#### 5. **artist_salons** (Many-to-Many Pivot)
```sql
CREATE TABLE artist_salons (
  id SERIAL PRIMARY KEY,
  artist_id UUID NOT NULL,
  salon_id UUID NOT NULL,

  -- Relationship
  relationship_type ENUM('primary','guest','freelance') DEFAULT 'guest',
  is_active BOOLEAN DEFAULT true,

  -- Schedule & Rates
  schedule JSONB,
  hourly_rate DECIMAL(8,2),
  commission_rate DECIMAL(5,2), -- 0-100%

  -- Timeline
  started_working_at DATE,
  ended_working_at DATE,
  notes TEXT,

  -- Permissions
  can_book_appointments BOOLEAN DEFAULT true,
  can_manage_schedule BOOLEAN DEFAULT false,
  has_salon_key BOOLEAN DEFAULT false,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,

  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE,
  FOREIGN KEY (salon_id) REFERENCES salons(id) ON DELETE CASCADE,

  UNIQUE(artist_id, salon_id)
);

CREATE INDEX idx_artist_salons_artist ON artist_salons(artist_id);
CREATE INDEX idx_artist_salons_salon ON artist_salons(salon_id);
CREATE INDEX idx_artist_salons_artist_active ON artist_salons(artist_id, is_active);
CREATE INDEX idx_artist_salons_salon_active ON artist_salons(salon_id, is_active);
CREATE INDEX idx_artist_salons_relationship ON artist_salons(relationship_type, is_active);
```

---

### Content Tables

#### 6. **tattoos** (Portfolio)
```sql
CREATE TABLE tattoos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  artist_id UUID NOT NULL,

  -- Content
  title VARCHAR NOT NULL,
  description TEXT,
  slug VARCHAR NOT NULL UNIQUE,

  -- Media
  original_filename VARCHAR NOT NULL,
  storage_path VARCHAR NOT NULL,
  image_variants JSONB NOT NULL, -- {thumbnail, medium, large, original}
  primary_color VARCHAR,
  file_size INTEGER NOT NULL,
  dimensions JSONB NOT NULL, -- {width, height, aspect_ratio}
  content_type VARCHAR(50) DEFAULT 'image/jpeg',
  content_hash VARCHAR(64), -- SHA256 for duplicates

  -- Characteristics
  tattoo_style ENUM('traditional','neo_traditional','realistic','black_and_grey',...),
  body_placement ENUM('arm','leg','back','chest','shoulder',...),
  size_category ENUM('small','medium','large','full_piece'),
  color_type ENUM('black_and_grey','color','single_color'),
  session_count INTEGER,
  estimated_hours DECIMAL(4,1),

  -- Visibility
  status ENUM('draft','pending_review','published','archived') DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  is_portfolio_highlight BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,

  -- Metrics
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  engagement_score DECIMAL(5,2) DEFAULT 0,

  -- Business
  allows_inquiries BOOLEAN DEFAULT true,
  shows_pricing BOOLEAN DEFAULT false,
  price_estimate DECIMAL(8,2),
  price_currency VARCHAR(3) DEFAULT 'EUR',

  -- SEO
  alt_text JSONB,
  search_keywords JSONB,
  meta_title VARCHAR,
  meta_description TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  published_at TIMESTAMP,

  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE CASCADE
);

CREATE INDEX idx_tattoos_artist ON tattoos(artist_id);
CREATE INDEX idx_tattoos_artist_status ON tattoos(artist_id, status);
CREATE INDEX idx_tattoos_status_featured_published ON tattoos(status, is_featured, published_at);
CREATE INDEX idx_tattoos_style_status ON tattoos(tattoo_style, status);
CREATE INDEX idx_tattoos_placement_size ON tattoos(body_placement, size_category);
CREATE INDEX idx_tattoos_engagement ON tattoos(engagement_score, published_at);
CREATE INDEX idx_tattoos_created_status ON tattoos(created_at, status);
CREATE INDEX idx_tattoos_content_hash ON tattoos(content_hash);
CREATE INDEX idx_tattoos_title_description ON tattoos(title, description);

-- Full-text search (PostgreSQL GIN)
CREATE INDEX tattoos_search_idx ON tattoos
USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
```

---

#### 7. **tags** (Taxonomie)
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,

  -- Identity
  name VARCHAR NOT NULL UNIQUE,
  slug VARCHAR NOT NULL UNIQUE,
  description TEXT,

  -- Categorization
  category ENUM('style','subject','body_part','color','size','technique','mood','cultural','custom') NOT NULL,
  parent_tag_id INTEGER,
  level INTEGER DEFAULT 0,

  -- Visual
  color_code VARCHAR(7), -- #RRGGBB
  icon_name VARCHAR,
  display_order INTEGER DEFAULT 0,

  -- Popularity
  usage_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  popularity_score DECIMAL(5,2) DEFAULT 0,

  -- Moderation
  requires_approval BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT true,
  created_by VARCHAR,
  approved_by VARCHAR,

  -- i18n
  translations JSONB,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,

  FOREIGN KEY (parent_tag_id) REFERENCES tags(id) ON DELETE SET NULL
);

CREATE INDEX idx_tags_category ON tags(category);
CREATE INDEX idx_tags_category_approved ON tags(category, is_approved);
CREATE INDEX idx_tags_usage_approved ON tags(usage_count, is_approved);
CREATE INDEX idx_tags_popularity_category ON tags(popularity_score, category);
CREATE INDEX idx_tags_trending_category ON tags(is_trending, category);
```

---

#### 8. **tag_tattoos** (Tagging Pivot)
```sql
CREATE TABLE tag_tattoos (
  id SERIAL PRIMARY KEY,
  tag_id INTEGER UNSIGNED NOT NULL,
  tattoo_id UUID NOT NULL,

  -- Relationship
  relevance_score DECIMAL(3,2) DEFAULT 1.0 CHECK (relevance_score BETWEEN 0 AND 1),
  is_primary BOOLEAN DEFAULT false,
  assignment_type ENUM('manual','auto','ai_suggested') DEFAULT 'manual',

  -- Moderation
  is_approved BOOLEAN DEFAULT true,
  approved_by VARCHAR,
  approval_notes TEXT,

  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,

  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  FOREIGN KEY (tattoo_id) REFERENCES tattoos(id) ON DELETE CASCADE,

  UNIQUE(tag_id, tattoo_id)
);

CREATE INDEX idx_tag_tattoos_tattoo_primary ON tag_tattoos(tattoo_id, is_primary);
CREATE INDEX idx_tag_tattoos_tag_relevance ON tag_tattoos(tag_id, relevance_score);
CREATE INDEX idx_tag_tattoos_approved_relevance ON tag_tattoos(is_approved, relevance_score);
```

---

### Interaction Tables

#### 9. **contact_inquiries** (Demandes de contact)
```sql
CREATE TABLE contact_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Contact info
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,

  -- Project details
  project_type ENUM('consultation','quote','appointment','question') NOT NULL,
  budget VARCHAR(50),
  preferred_date VARCHAR(100),
  location VARCHAR(200),
  tattoo_styles JSONB,
  size VARCHAR(50),
  placement VARCHAR(100),
  has_existing_tattoos BOOLEAN DEFAULT false,
  reference_images JSONB,

  -- Relationships
  artist_id UUID,
  tattoo_id UUID,

  -- Status & Tracking
  status ENUM('pending','in_progress','replied','closed','spam') DEFAULT 'pending',
  source ENUM('website','quick_form','social_media','referral') DEFAULT 'website',
  priority INTEGER DEFAULT 3 CHECK (priority BETWEEN 1 AND 10),
  is_read BOOLEAN DEFAULT false,
  is_starred BOOLEAN DEFAULT false,

  -- Technical
  ip_address VARCHAR(45),
  user_agent VARCHAR(500),
  metadata JSONB,

  -- Response tracking
  first_replied_at TIMESTAMP,
  last_replied_at TIMESTAMP,
  replies_count INTEGER DEFAULT 0,

  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,

  FOREIGN KEY (artist_id) REFERENCES artists(id) ON DELETE SET NULL,
  FOREIGN KEY (tattoo_id) REFERENCES tattoos(id) ON DELETE SET NULL
);

CREATE INDEX idx_contact_inquiries_artist_status ON contact_inquiries(artist_id, status);
CREATE INDEX idx_contact_inquiries_status_priority ON contact_inquiries(status, priority);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at);
CREATE INDEX idx_contact_inquiries_email ON contact_inquiries(email);
CREATE INDEX idx_contact_inquiries_read_status ON contact_inquiries(is_read, status);
```

---

### Support Tables

#### 10. **auth_access_tokens** (Token-based auth)
```sql
CREATE TABLE auth_access_tokens (
  id SERIAL PRIMARY KEY,
  tokenable_id INTEGER NOT NULL,
  type VARCHAR NOT NULL,
  name VARCHAR,
  hash VARCHAR NOT NULL UNIQUE,
  abilities TEXT,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  last_used_at TIMESTAMP,
  expires_at TIMESTAMP,

  FOREIGN KEY (tokenable_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Note:** Session-based auth est utilisé (config/auth.ts), pas de JWT actuellement.

---

#### 11. **rate_limits** (Rate limiting)
```sql
CREATE TABLE rate_limits (
  id SERIAL PRIMARY KEY,
  key VARCHAR NOT NULL UNIQUE,
  points INTEGER NOT NULL,
  expire_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
```

**Configured in:** `app/middleware/rate_limit_middleware.ts`
**Rules:**
- Registration: 5 req/15min per IP
- Login: 10 req/15min per IP
- Contact: 5 req/15min per IP

---

## Migrations Historique

| # | Timestamp | Migration | Description |
|---|-----------|-----------|-------------|
| 1 | 1758867281904 | create_users_table | Base users avec email/password |
| 2 | 1758873773759 | enhance_users_table | Ajout role, profil, géoloc, vérification |
| 3 | 1758873775688 | create_cities_table | Villes françaises (INSEE) |
| 4 | 1758873777609 | create_auth_access_tokens_table | Token auth (pas utilisé) |
| 5 | 1758874028466 | add_foreign_key_to_users_table | users.city_id FK |
| 6 | 1758875914543 | create_salons_table | Salons de tatouage |
| 7 | 1758875962147 | create_artists_table | Profils artistes |
| 8 | 1758875995117 | create_artist_salons_table | Pivot artistes-salons |
| 9 | 1758881037134 | create_tattoos_table | Portfolio tattoos |
| 10 | 1758881039076 | create_tags_table | Système de tags |
| 11 | 1758881041129 | create_tag_tattoos_table | Pivot tags-tattoos |
| 12 | 1758907929750 | create_contact_inquiries_table | Demandes de contact |
| 13 | 1758909180980 | optimize_contact_inquiries_performances_table | Index perf sur inquiries |
| 14 | 1759652894479 | create_rate_limits_table | Rate limiting system |

---

## Dette Technique (Database)

### Issues Identifiées

#### 1. **Colonnes Inutilisées**
- `auth_access_tokens` table: Créée mais session-based auth utilisé
- `users.avatar_url`: Pas de système upload avatar implémenté
- `users.birth_date`, `users.gender`: Collectés mais pas exploités

#### 2. **Index Manquants (Critiques)**
```sql
-- Performance queries lentes identifiées:
CREATE INDEX idx_tattoos_published ON tattoos(published_at DESC) WHERE status='published';
CREATE INDEX idx_artists_slug_verified ON artists(slug) WHERE verification_status='verified';
CREATE INDEX idx_contact_inquiries_unread ON contact_inquiries(created_at DESC) WHERE is_read=false;
```

#### 3. **Contraintes Manquantes**
```sql
-- Validation métier au niveau DB
ALTER TABLE artists ADD CONSTRAINT chk_experience_years
  CHECK (years_experience IS NULL OR years_experience >= 0);

ALTER TABLE tattoos ADD CONSTRAINT chk_engagement_score
  CHECK (engagement_score >= 0);

ALTER TABLE artist_salons ADD CONSTRAINT chk_commission_rate
  CHECK (commission_rate IS NULL OR commission_rate BETWEEN 0 AND 100);
```

#### 4. **Seeders Manquants**
- ✅ Cities seeder (implémenté)
- ❌ Artists seeder (pour dev/test)
- ❌ Tattoos seeder (mock portfolio)
- ❌ Tags seeder (styles populaires)

---

## Recommandations

### P0 (Critique)
1. Ajouter index performance (queries lentes)
2. Compléter seeders pour dev/test
3. Cleanup auth_access_tokens si non utilisé

### P1 (Important)
1. Ajouter contraintes validation métier
2. Archivage automatique (tattoos > 90j sans views)
3. Soft delete généralisé (deleted_at columns)

### P2 (Amélioration)
1. Partitioning contact_inquiries par date (>1M rows)
2. Materialized views pour analytics
3. JSONB validation schemas (art_styles, availability, etc.)

---

**Version:** 1.0.0
**Last Updated:** 2025-10-05

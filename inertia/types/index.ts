// User types
export interface User {
  id: string
  email: string
  role: 'client' | 'artist'
  emailVerifiedAt: string | null
  createdAt: string
  updatedAt: string
}

// Artist types
export interface Artist {
  id: string
  userId: string
  name: string
  bio: string | null
  verified: boolean
  availability: 'available' | 'busy' | 'unavailable'
  phoneVerifiedAt: string | null
  experienceYears: number | null
  hourlyRate: number | null
  instagramUrl: string | null
  portfolioUrl: string | null
  locationLat: number | null
  locationLng: number | null
  createdAt: string
  updatedAt: string

  // Relations
  user?: User
  tattoos?: Tattoo[]
  salons?: Salon[]
  tags?: Tag[]
}

// Salon types
export interface Salon {
  id: string
  name: string
  description: string | null
  address: string
  phone: string | null
  email: string | null
  website: string | null
  instagramUrl: string | null
  verified: boolean
  rating: number
  reviewCount: number
  locationLat: number
  locationLng: number
  cityId: string
  createdAt: string
  updatedAt: string

  // Relations
  city?: City
  artists?: Artist[]
}

// Tattoo types
export interface Tattoo {
  id: string
  artistId: string
  title: string
  description: string | null
  imageUrl: string
  imageVariants: Record<string, string>
  estimatedDuration: number | null
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  bodyPlacement: string | null
  size: 'small' | 'medium' | 'large' | 'xl'
  colorStyle: 'black_grey' | 'color' | 'mixed'
  price: number | null
  isPublic: boolean
  likesCount: number
  viewsCount: number
  featured: boolean
  createdAt: string
  updatedAt: string

  // Relations
  artist?: Artist
  tags?: Tag[]
}

// Tag types
export interface Tag {
  id: string
  name: string
  nameEn: string | null
  slug: string
  description: string | null
  color: string | null
  isPopular: boolean
  parentId: string | null
  createdAt: string
  updatedAt: string

  // Relations
  parent?: Tag
  children?: Tag[]
  tattoos?: Tattoo[]
}

// City types
export interface City {
  id: string
  name: string
  slug: string
  postalCode: string
  latitude: number
  longitude: number
  population: number | null
  inseeCode: string
  createdAt: string
  updatedAt: string
}

// Form types
export interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export interface RegisterForm {
  email: string
  password: string
  passwordConfirmation: string
  role: 'client' | 'artist'
}

export interface ProjectInquiryForm {
  description: string
  bodyZone: string
  size: 'small' | 'medium' | 'large' | 'xl'
  budget: string
  email: string
}

// Search and filter types
export interface ArtistFilters {
  styles?: string[]
  city?: string
  sortBy?: 'recent' | 'popular' | 'rating' | 'distance'
  availability?: 'available' | 'busy' | 'unavailable'
  experienceYears?: number
  hourlyRateMin?: number
  hourlyRateMax?: number
}

export interface TattooFilters {
  styles?: string[]
  size?: ('small' | 'medium' | 'large' | 'xl')[]
  colorStyle?: ('black_grey' | 'color' | 'mixed')[]
  bodyPlacement?: string[]
  difficultyLevel?: ('beginner' | 'intermediate' | 'advanced' | 'expert')[]
  priceMin?: number
  priceMax?: number
  sortBy?: 'recent' | 'popular' | 'likes' | 'views'
}

// API response types
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
    firstPage: number
    firstPageUrl: string
    lastPageUrl: string
    nextPageUrl: string | null
    previousPageUrl: string | null
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ValidationError {
  message: string
  errors: Record<string, string[]>
}

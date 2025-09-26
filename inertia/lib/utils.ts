import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Map utility functions
export const MAP_CONFIG = {
  // Default center of France
  DEFAULT_CENTER: [46.603354, 1.888334] as [number, number],
  DEFAULT_ZOOM: 6,
  CITY_ZOOM: 12,

  // French cities with coordinates for demo data
  FRENCH_CITIES: {
    Paris: { latitude: 48.8566, longitude: 2.3522 },
    Rouen: { latitude: 49.4431, longitude: 1.0993 },
    Troyes: { latitude: 48.2973, longitude: 4.0744 },
    Poitiers: { latitude: 46.5802, longitude: 0.3404 },
    Lyon: { latitude: 45.764, longitude: 4.8357 },
    Marseille: { latitude: 43.2965, longitude: 5.3698 },
    Toulouse: { latitude: 43.6047, longitude: 1.4442 },
    Nice: { latitude: 43.7102, longitude: 7.262 },
    Nantes: { latitude: 47.2184, longitude: -1.5536 },
    Strasbourg: { latitude: 48.5734, longitude: 7.7521 },
    Montpellier: { latitude: 43.611, longitude: 3.8767 },
    Bordeaux: { latitude: 44.8378, longitude: -0.5792 },
    Lille: { latitude: 50.6292, longitude: 3.0573 },
    Rennes: { latitude: 48.1173, longitude: -1.6778 },
    Sarralbe: { latitude: 49.0006, longitude: 7.0144 },
  },
} as const

// Generate sample artist data for demonstration
export const generateSampleArtists = (): Array<{
  id: string
  stageName: string
  city: {
    name: string
    latitude: number
    longitude: number
  }
  slug: string
  specialty?: string
  artStyles?: string[]
  portfolioImages?: string[]
  totalReviews: number
  averageRating?: number
  isVerified: boolean
  isFeatured: boolean
}> => {
  const artStyles = [
    'Trash Polka',
    'Néo-traditionnel',
    'Japonais',
    'Cartoon',
    'Réaliste',
    'Géométrique',
    'Polynésien',
    'Graphique',
    'Écriture',
    'Celtique',
    'Floral',
    'Witchy',
    'Mexicain',
    'Sketch',
    'Religieux',
  ]

  const cities = Object.entries(MAP_CONFIG.FRENCH_CITIES)

  return [
    {
      id: '1',
      stageName: 'Hervé',
      city: {
        name: 'Sarralbe',
        ...MAP_CONFIG.FRENCH_CITIES['Sarralbe'],
      },
      slug: 'herve',
      specialty: 'Trash Polka',
      artStyles: ['Trash Polka', 'Néo-traditionnel', 'Japonais', 'Cartoon'],
      portfolioImages: [],
      totalReviews: 47,
      averageRating: 4.8,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: '2',
      stageName: 'dju.mtf',
      city: {
        name: 'Paris',
        ...MAP_CONFIG.FRENCH_CITIES['Paris'],
      },
      slug: 'dju-mtf',
      specialty: 'Trash Polka',
      artStyles: ['Trash Polka'],
      portfolioImages: [],
      totalReviews: 23,
      averageRating: 4.6,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: '3',
      stageName: 'Nastick',
      city: {
        name: 'Rouen',
        ...MAP_CONFIG.FRENCH_CITIES['Rouen'],
      },
      slug: 'nastick',
      specialty: 'Géométrique',
      artStyles: ['Géométrique', 'Graphique', 'Sketch'],
      portfolioImages: [],
      totalReviews: 34,
      averageRating: 4.7,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: '4',
      stageName: 'Luna Ink',
      city: {
        name: 'Lyon',
        ...MAP_CONFIG.FRENCH_CITIES['Lyon'],
      },
      slug: 'luna-ink',
      specialty: 'Floral',
      artStyles: ['Floral', 'Witchy', 'Géométrique'],
      portfolioImages: [],
      totalReviews: 19,
      averageRating: 4.9,
      isVerified: false,
      isFeatured: false,
    },
    {
      id: '5',
      stageName: 'Phoenix Art',
      city: {
        name: 'Marseille',
        ...MAP_CONFIG.FRENCH_CITIES['Marseille'],
      },
      slug: 'phoenix-art',
      specialty: 'Polynésien',
      artStyles: ['Polynésien', 'Celtique', 'Religieux'],
      portfolioImages: [],
      totalReviews: 56,
      averageRating: 4.5,
      isVerified: true,
      isFeatured: false,
    },
    {
      id: '6',
      stageName: 'Rebel Skin',
      city: {
        name: 'Toulouse',
        ...MAP_CONFIG.FRENCH_CITIES['Toulouse'],
      },
      slug: 'rebel-skin',
      specialty: 'Réaliste',
      artStyles: ['Réaliste', 'Mexicain', 'Écriture'],
      portfolioImages: [],
      totalReviews: 41,
      averageRating: 4.4,
      isVerified: true,
      isFeatured: true,
    },
    {
      id: '7',
      stageName: 'Midnight Canvas',
      city: {
        name: 'Nice',
        ...MAP_CONFIG.FRENCH_CITIES['Nice'],
      },
      slug: 'midnight-canvas',
      specialty: 'Japonais',
      artStyles: ['Japonais', 'Néo-traditionnel'],
      portfolioImages: [],
      totalReviews: 28,
      averageRating: 4.6,
      isVerified: false,
      isFeatured: false,
    },
    {
      id: '8',
      stageName: 'Iron Rose',
      city: {
        name: 'Nantes',
        ...MAP_CONFIG.FRENCH_CITIES['Nantes'],
      },
      slug: 'iron-rose',
      specialty: 'Cartoon',
      artStyles: ['Cartoon', 'Sketch', 'Graphique'],
      portfolioImages: [],
      totalReviews: 15,
      averageRating: 4.3,
      isVerified: true,
      isFeatured: false,
    },
  ]
}

// Format distance for display
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`
  }
  return `${distanceKm.toFixed(1)}km`
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Debounce function for search and map interactions
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    timeout = setTimeout(() => {
      func(...args)
    }, wait)
  }
}

// Format price range for display
export const formatPriceRange = (
  minPrice?: number | null,
  maxPrice?: number | null,
  currency: string = 'EUR'
): string | null => {
  if (!minPrice && !maxPrice) return null

  const formatter = new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
  })

  if (minPrice && maxPrice) {
    return `${formatter.format(minPrice)} - ${formatter.format(maxPrice)}`
  }

  if (minPrice) {
    return `À partir de ${formatter.format(minPrice)}`
  }

  return `Jusqu'à ${formatter.format(maxPrice!)}`
}

// Validate coordinates
export const isValidCoordinates = (lat: number, lng: number): boolean => {
  return (
    lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && !Number.isNaN(lat) && !Number.isNaN(lng)
  )
}

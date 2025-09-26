import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'

// Types for the map component
export interface ArtistMapData {
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
}

export interface InteractiveMapProps {
  artists: ArtistMapData[]
  className?: string
  height?: string
  onArtistSelect?: (artist: ArtistMapData) => void
  selectedArtist?: ArtistMapData | null
  center?: [number, number] // [latitude, longitude]
  zoom?: number
}

export interface ArtistPopoverProps {
  artist: ArtistMapData
  onClose: () => void
  onViewProfile: (artist: ArtistMapData) => void
}

// Artist popover component for map markers
const ArtistPopover: React.FC<ArtistPopoverProps> = ({ artist, onClose, onViewProfile }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border p-4 min-w-64 max-w-72">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-gray-600">
              {artist.stageName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{artist.stageName}</h3>
            <p className="text-sm text-gray-600">{artist.city.name}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Artist badges */}
      <div className="flex flex-wrap gap-1 mb-3">
        {artist.isVerified && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            Vérifié
          </span>
        )}
        {artist.isFeatured && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            Mis en avant
          </span>
        )}
      </div>

      {/* Art styles */}
      {artist.artStyles && artist.artStyles.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {artist.artStyles.slice(0, 3).map((style, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
              >
                {style}
              </span>
            ))}
            {artist.artStyles.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                +{artist.artStyles.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Rating and reviews */}
      {artist.averageRating && (
        <div className="mb-3 flex items-center space-x-1 text-sm text-gray-600">
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{artist.averageRating.toFixed(1)}</span>
          <span>({artist.totalReviews} avis)</span>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={() => onViewProfile(artist)}
        className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
      >
        Voir le profil
      </button>
    </div>
  )
}

// Main Interactive Map Component
export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  artists,
  className,
  height = '500px',
  onArtistSelect,
  selectedArtist,
  center = [46.603354, 1.888334], // Center of France
  zoom = 6,
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const [selectedMarker, setSelectedMarker] = useState<ArtistMapData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [leafletLoaded, setLeafletLoaded] = useState(false)

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Import Leaflet CSS
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)

        // Import Leaflet JS
        const script = document.createElement('script')
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.onload = () => {
          setLeafletLoaded(true)
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load Leaflet:', error)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return

    // @ts-ignore - Leaflet is loaded dynamically
    const L = window.L

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center,
      zoom: zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map)

    mapInstanceRef.current = map
    setIsLoading(false)

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, center, zoom])

  // Update markers when artists change
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletLoaded || !artists.length) return

    // @ts-ignore - Leaflet is loaded dynamically
    const L = window.L

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker)
    })
    markersRef.current = []

    // Create custom marker icon
    const createMarkerIcon = (isFeatured: boolean) => {
      const color = isFeatured ? '#ef4444' : '#dc2626' // Red colors
      return L.divIcon({
        html: `
          <div style="
            background-color: ${color};
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `,
        className: 'custom-div-icon',
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      })
    }

    // Group artists by city to avoid overlapping markers
    const artistsByCity = artists.reduce((acc, artist) => {
      const key = `${artist.city.latitude}-${artist.city.longitude}`
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(artist)
      return acc
    }, {} as Record<string, ArtistMapData[]>)

    // Create markers for each city
    Object.entries(artistsByCity).forEach(([key, cityArtists]) => {
      const firstArtist = cityArtists[0]
      const isFeatured = cityArtists.some(artist => artist.isFeatured)

      const marker = L.marker(
        [firstArtist.city.latitude, firstArtist.city.longitude],
        { icon: createMarkerIcon(isFeatured) }
      )

      // Create popup content
      const createPopupContent = () => {
        if (cityArtists.length === 1) {
          return cityArtists[0]
        }
        // For multiple artists in same city, show the featured one or first one
        return cityArtists.find(artist => artist.isFeatured) || cityArtists[0]
      }

      marker.on('click', () => {
        const artistToShow = createPopupContent()
        setSelectedMarker(artistToShow)
        onArtistSelect?.(artistToShow)
      })

      marker.addTo(mapInstanceRef.current)
      markersRef.current.push(marker)
    })

    // Auto-fit bounds if there are artists
    if (artists.length > 0) {
      const group = new L.featureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1))
    }
  }, [artists, leafletLoaded, onArtistSelect])

  // Handle selected artist from external source
  useEffect(() => {
    if (selectedArtist) {
      setSelectedMarker(selectedArtist)

      if (mapInstanceRef.current && leafletLoaded) {
        mapInstanceRef.current.setView(
          [selectedArtist.city.latitude, selectedArtist.city.longitude],
          12
        )
      }
    }
  }, [selectedArtist, leafletLoaded])

  const handleClosePopover = () => {
    setSelectedMarker(null)
  }

  const handleViewProfile = (artist: ArtistMapData) => {
    // Navigate to artist profile - this would typically use Inertia or React Router
    window.location.href = `/artistes/${artist.slug}`
  }

  return (
    <div className={cn('relative overflow-hidden rounded-lg border border-gray-200', className)}>
      {/* Loading state */}
      {isLoading && (
        <div
          className="flex items-center justify-center bg-gray-100"
          style={{ height }}
        >
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <p className="mt-2 text-sm text-gray-600">Chargement de la carte...</p>
          </div>
        </div>
      )}

      {/* Map container */}
      <div
        ref={mapRef}
        className={cn('w-full', isLoading && 'hidden')}
        style={{ height }}
      />

      {/* Artist popover */}
      {selectedMarker && (
        <div className="absolute top-4 left-4 z-[1000]">
          <ArtistPopover
            artist={selectedMarker}
            onClose={handleClosePopover}
            onViewProfile={handleViewProfile}
          />
        </div>
      )}

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 text-xs">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-600 rounded-full border border-white"></div>
            <span>Artistes disponibles</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full border border-white"></div>
            <span>Mis en avant</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Hook for map functionality
export const useInteractiveMap = () => {
  const [selectedArtist, setSelectedArtist] = useState<ArtistMapData | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([46.603354, 1.888334])
  const [mapZoom, setMapZoom] = useState(6)

  const selectArtist = (artist: ArtistMapData) => {
    setSelectedArtist(artist)
    setMapCenter([artist.city.latitude, artist.city.longitude])
    setMapZoom(12)
  }

  const clearSelection = () => {
    setSelectedArtist(null)
    setMapCenter([46.603354, 1.888334])
    setMapZoom(6)
  }

  const centerOnFrance = () => {
    setMapCenter([46.603354, 1.888334])
    setMapZoom(6)
  }

  return {
    selectedArtist,
    mapCenter,
    mapZoom,
    selectArtist,
    clearSelection,
    centerOnFrance,
  }
}

export default InteractiveMap
import React, { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { MainLayout } from '../../components/layout/MainLayout'
import { FilterBar } from '../../components/discovery/FilterBar'
import { ArtistCard, Artist } from '../../components/discovery/ArtistCard'
import { Button } from '../../components/ui/Button'
import { cn } from '../../lib/utils'

interface ArtistsIndexProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
  initialArtists?: Artist[]
  totalCount?: number
}

export default function ArtistsIndex({
  user,
  initialArtists = [],
  totalCount = 0,
}: ArtistsIndexProps) {
  const [artists, setArtists] = useState<Artist[]>(initialArtists)
  const [loading, setLoading] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid')

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'distance' | 'rating'>('recent')

  // Mock data for development - replace with real API call
  useEffect(() => {
    const mockArtists: Artist[] = [
      {
        id: '1',
        name: 'Hervé Tatoueur',
        location: 'Paris',
        bio: "Spécialiste du style trash polka avec plus de 10 ans d'expérience. Passionné par les créations uniques et personnalisées.",
        styles: ['Trash Polka', 'Neo-traditional', 'Blackwork'],
        portfolioPreview: [
          'https://images.unsplash.com/photo-1565059336749-9e4b5b2a0c1a?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400',
        ],
        rating: 4.8,
        reviewCount: 127,
        verified: true,
      },
      {
        id: '2',
        name: 'dju.mtl',
        location: 'Lyon',
        bio: 'Artiste tatoueur montréalais installé à Lyon. Style graphique moderne avec influences street art.',
        styles: ['Graphique', 'Géométrique', 'Dotwork'],
        portfolioPreview: [
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400',
          'https://images.unsplash.com/photo-1611211232932-da3113c06042?w=400',
        ],
        rating: 4.9,
        reviewCount: 89,
        verified: true,
      },
      {
        id: '3',
        name: 'Alex Pheles',
        location: 'Marseille',
        bio: "Tatoueur spécialisé dans le réalisme et les portraits. Chaque tatouage est une œuvre d'art unique.",
        styles: ['Réaliste', 'Portraits', 'Noir et gris'],
        portfolioPreview: [
          'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
          'https://images.unsplash.com/photo-1567095761201-9be44a1f9b6a?w=400',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        ],
        rating: 4.7,
        reviewCount: 203,
        verified: false,
      },
      {
        id: '4',
        name: 'Marine Ink',
        location: 'Toulouse',
        bio: 'Artiste spécialisée dans les tatouages floraux délicats et les motifs aquarelle.',
        styles: ['Floral', 'Aquarelle', 'Délicat'],
        portfolioPreview: [
          'https://images.unsplash.com/photo-1565059336749-9e4b5b2a0c1a?w=400',
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        ],
        rating: 4.6,
        reviewCount: 156,
        verified: true,
      },
      {
        id: '5',
        name: 'Dark Arts Studio',
        location: 'Nice',
        bio: "Collectif d'artistes spécialisés dans le dark art, horror et styles gothiques.",
        styles: ['Dark Art', 'Horror', 'Gothique'],
        portfolioPreview: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400'],
        rating: 4.5,
        reviewCount: 74,
        verified: false,
      },
      {
        id: '6',
        name: 'Polynesian Soul',
        location: 'Bordeaux',
        bio: 'Maître tatoueur polynésien traditionnel. Chaque motif raconte une histoire ancestrale.',
        styles: ['Polynésien', 'Tribal', 'Traditionnel'],
        portfolioPreview: [
          'https://images.unsplash.com/photo-1611211232932-da3113c06042?w=400',
          'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400',
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
        ],
        rating: 4.9,
        reviewCount: 312,
        verified: true,
      },
    ]

    setArtists(mockArtists)
  }, [])

  // Filter logic
  const filteredArtists = artists.filter((artist) => {
    const matchesSearch =
      !searchQuery ||
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.styles.some((style) => style.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStyles =
      selectedStyles.length === 0 || selectedStyles.some((style) => artist.styles.includes(style))

    const matchesLocation = !selectedLocation || artist.location === selectedLocation

    return matchesSearch && matchesStyles && matchesLocation
  })

  // Sort logic
  const sortedArtists = [...filteredArtists].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.reviewCount || 0) - (a.reviewCount || 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'distance':
        // Mock distance sorting - in real app, would use geolocation
        return a.location.localeCompare(b.location)
      case 'recent':
      default:
        return a.name.localeCompare(b.name)
    }
  })

  const handleStyleToggle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    )
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedStyles([])
    setSelectedLocation('')
    setSortBy('recent')
  }

  const handleArtistClick = (artist: Artist) => {
    // Navigate to artist profile - replace with actual navigation
    console.log('Navigate to artist:', artist.id)
  }

  return (
    <MainLayout
      title="Artistes Tatoueurs - Blottr"
      description="Découvrez les meilleurs artistes tatoueurs près de chez vous"
      user={user}
    >
      <Head title="Artistes - Blottr" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Découvrez nos artistes</h1>
        <p className="text-gray-600">
          Trouvez l'artiste parfait pour votre prochain tatouage parmi {artists.length} tatoueurs
          vérifiés
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <FilterBar
          searchQuery={searchQuery}
          selectedStyles={selectedStyles}
          selectedLocation={selectedLocation}
          sortBy={sortBy}
          onSearchChange={setSearchQuery}
          onStyleToggle={handleStyleToggle}
          onLocationChange={setSelectedLocation}
          onSortChange={setSortBy}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            <span className="font-semibold">{sortedArtists.length}</span> artistes trouvés
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
            Grille
          </Button>

          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('map')}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            Carte
          </Button>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} onClick={() => handleArtistClick(artist)} />
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <svg
              className="w-12 h-12 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Vue carte</h3>
            <p className="text-gray-500">La vue carte sera implémentée dans la phase suivante</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {sortedArtists.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun artiste trouvé</h3>
          <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
          <Button onClick={handleClearFilters} variant="outline">
            Effacer les filtres
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </MainLayout>
  )
}

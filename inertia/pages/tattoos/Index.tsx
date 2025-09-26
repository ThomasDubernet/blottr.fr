import React, { useState, useEffect } from 'react'
import { Head } from '@inertiajs/react'
import { MainLayout } from '../../components/layout/MainLayout'
import { FilterBar } from '../../components/discovery/FilterBar'
import { TattooCard, Tattoo } from '../../components/discovery/TattooCard'
import { MasonryGrid, useMasonryGrid, QuickViewModal } from '../../components/gallery'
import { Button } from '../../components/ui/Button'

interface TattoosIndexProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
  initialTattoos?: Tattoo[]
  totalCount?: number
}

export default function TattoosIndex({
  user,
  initialTattoos = [],
  totalCount = 0,
}: TattoosIndexProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedLocation, setSelectedLocation] = useState('')
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'distance' | 'rating'>('recent')

  // Masonry grid state
  const { items: tattoos, loading, hasMore, loadMore, reset } = useMasonryGrid<Tattoo>([], 20)

  // Quick view modal state
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Mock tattoo data for development
  const mockTattoos: Tattoo[] = [
    {
      id: '1',
      title: 'Dragon Japonais',
      imageUrl: 'https://images.unsplash.com/photo-1565059336749-9e4b5b2a0c1a?w=400&h=600&fit=crop',
      artist: { id: '1', name: 'Hervé Tatoueur', location: 'Paris' },
      styles: ['Japonais', 'Dragon', 'Traditionnel'],
      likes: 234,
      isLiked: false,
      description:
        'Dragon traditionnel japonais avec des détails minutieux et un style authentique.',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Géométrie Sacrée',
      imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=500&fit=crop',
      artist: { id: '2', name: 'dju.mtl', location: 'Lyon' },
      styles: ['Géométrique', 'Dotwork', 'Spirituel'],
      likes: 189,
      isLiked: true,
      description: 'Motif géométrique inspiré de la géométrie sacrée avec des patterns complexes.',
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      title: 'Portrait Réaliste',
      imageUrl: 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=650&fit=crop',
      artist: { id: '3', name: 'Alex Pheles', location: 'Marseille' },
      styles: ['Réaliste', 'Portrait', 'Noir et gris'],
      likes: 421,
      isLiked: false,
      description: 'Portrait photo-réaliste en noir et gris avec des ombres parfaites.',
      createdAt: '2024-01-18',
    },
    {
      id: '4',
      title: 'Fleur Aquarelle',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=550&fit=crop',
      artist: { id: '4', name: 'Marine Ink', location: 'Toulouse' },
      styles: ['Aquarelle', 'Floral', 'Délicat'],
      likes: 167,
      isLiked: false,
      description: 'Fleur délicate dans un style aquarelle avec des couleurs douces.',
      createdAt: '2024-01-22',
    },
    {
      id: '5',
      title: 'Crâne Dark Art',
      imageUrl: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=580&fit=crop',
      artist: { id: '5', name: 'Dark Arts Studio', location: 'Nice' },
      styles: ['Dark Art', 'Crâne', 'Gothic'],
      likes: 298,
      isLiked: true,
      description: 'Crâne stylisé dans un style dark art avec des détails gothiques.',
      createdAt: '2024-01-25',
    },
    {
      id: '6',
      title: 'Tribal Polynésien',
      imageUrl: 'https://images.unsplash.com/photo-1611211232932-da3113c06042?w=400&h=620&fit=crop',
      artist: { id: '6', name: 'Polynesian Soul', location: 'Bordeaux' },
      styles: ['Polynésien', 'Tribal', 'Traditionnel'],
      likes: 356,
      isLiked: false,
      description: 'Motif tribal polynésien traditionnel avec signification ancestrale.',
      createdAt: '2024-01-28',
    },
    {
      id: '7',
      title: 'Mandala Précis',
      imageUrl: 'https://images.unsplash.com/photo-1567095761201-9be44a1f9b6a?w=400&h=400&fit=crop',
      artist: { id: '2', name: 'dju.mtl', location: 'Lyon' },
      styles: ['Mandala', 'Géométrique', 'Spirituel'],
      likes: 445,
      isLiked: true,
      description: 'Mandala complexe avec des motifs géométriques précis et équilibrés.',
      createdAt: '2024-01-30',
    },
    {
      id: '8',
      title: 'Rose Noire',
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=480&fit=crop',
      artist: { id: '1', name: 'Hervé Tatoueur', location: 'Paris' },
      styles: ['Floral', 'Noir et gris', 'Classique'],
      likes: 203,
      isLiked: false,
      description: 'Rose classique en noir et gris avec des détails fins et des ombres profondes.',
      createdAt: '2024-02-01',
    },
    {
      id: '9',
      title: 'Loup Réaliste',
      imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=590&fit=crop',
      artist: { id: '3', name: 'Alex Pheles', location: 'Marseille' },
      styles: ['Réaliste', 'Animal', 'Nature'],
      likes: 378,
      isLiked: false,
      description: 'Loup en style réaliste avec une attention particulière aux détails du pelage.',
      createdAt: '2024-02-03',
    },
    {
      id: '10',
      title: 'Papillon Aquarelle',
      imageUrl: 'https://images.unsplash.com/photo-1565059336749-9e4b5b2a0c1a?w=400&h=450&fit=crop',
      artist: { id: '4', name: 'Marine Ink', location: 'Toulouse' },
      styles: ['Aquarelle', 'Papillon', 'Couleur'],
      likes: 289,
      isLiked: true,
      description: 'Papillon coloré dans un style aquarelle avec des éclaboussures artistiques.',
      createdAt: '2024-02-05',
    },
  ]

  // Initialize with mock data
  useEffect(() => {
    reset(mockTattoos)
  }, [])

  // Filter logic
  const filteredTattoos = tattoos.filter((tattoo) => {
    const matchesSearch =
      !searchQuery ||
      tattoo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tattoo.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tattoo.artist.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tattoo.styles.some((style) => style.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStyles =
      selectedStyles.length === 0 || selectedStyles.some((style) => tattoo.styles.includes(style))

    const matchesLocation = !selectedLocation || tattoo.artist.location === selectedLocation

    return matchesSearch && matchesStyles && matchesLocation
  })

  // Sort logic
  const sortedTattoos = [...filteredTattoos].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return (b.likes || 0) - (a.likes || 0)
      case 'rating':
        // Mock rating sort - in real app would use actual ratings
        return (b.likes || 0) - (a.likes || 0)
      case 'distance':
        return a.artist.location.localeCompare(b.artist.location)
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
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

  const handleTattooClick = (tattoo: Tattoo) => {
    const index = sortedTattoos.findIndex((t) => t.id === tattoo.id)
    setSelectedTattoo(tattoo)
    setSelectedIndex(index)
    setQuickViewOpen(true)
  }

  const handleQuickViewClose = () => {
    setQuickViewOpen(false)
    setSelectedTattoo(null)
  }

  const handleQuickViewNext = () => {
    if (selectedIndex < sortedTattoos.length - 1) {
      const nextIndex = selectedIndex + 1
      setSelectedIndex(nextIndex)
      setSelectedTattoo(sortedTattoos[nextIndex])
    }
  }

  const handleQuickViewPrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      setSelectedIndex(prevIndex)
      setSelectedTattoo(sortedTattoos[prevIndex])
    }
  }

  const handleArtistClick = (artistId: string) => {
    // Navigate to artist profile
    console.log('Navigate to artist:', artistId)
  }

  const handleLikeToggle = (tattooId: string) => {
    // Toggle like in both the main list and selected tattoo
    const updatedTattoos = tattoos.map((tattoo) =>
      tattoo.id === tattooId
        ? {
            ...tattoo,
            isLiked: !tattoo.isLiked,
            likes: (tattoo.likes || 0) + (tattoo.isLiked ? -1 : 1),
          }
        : tattoo
    )
    reset(updatedTattoos)

    // Update selected tattoo if it's the same one
    if (selectedTattoo?.id === tattooId) {
      setSelectedTattoo({
        ...selectedTattoo,
        isLiked: !selectedTattoo.isLiked,
        likes: (selectedTattoo.likes || 0) + (selectedTattoo.isLiked ? -1 : 1),
      })
    }
  }

  // Mock load more function
  const mockLoadMore = async (page: number, pageSize: number) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate more mock tattoos (in real app, this would be an API call)
    const moreTattoos: Tattoo[] = Array.from({ length: pageSize }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      title: `Tattoo ${page}-${index + 1}`,
      imageUrl: `https://images.unsplash.com/photo-${1565059336749 + index}?w=400&h=${400 + Math.random() * 300}&fit=crop`,
      artist: {
        id: `artist-${(index % 6) + 1}`,
        name: ['Hervé', 'dju.mtl', 'Alex', 'Marine', 'Dark Arts', 'Polynesian'][index % 6],
        location: ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'][index % 6],
      },
      styles: [
        ['Traditionnel'],
        ['Géométrique'],
        ['Réaliste'],
        ['Aquarelle'],
        ['Dark Art'],
        ['Polynésien'],
      ][index % 6],
      likes: Math.floor(Math.random() * 500),
      isLiked: Math.random() > 0.7,
      description: `Description du tatouage ${page}-${index + 1}`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    }))

    return moreTattoos
  }

  return (
    <MainLayout
      title="Galerie de Tatouages - Blottr"
      description="Découvrez une collection inspirante de tatouages par les meilleurs artistes"
      user={user}
    >
      <Head title="Tatouages - Blottr" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Galerie de tatouages</h1>
        <p className="text-gray-600">
          Explorez {tattoos.length}+ tatouages pour trouver l'inspiration parfaite
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

      {/* Results Summary */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            <span className="font-semibold">{sortedTattoos.length}</span> tatouages trouvés
          </span>
        </div>
      </div>

      {/* Masonry Gallery */}
      <MasonryGrid
        items={sortedTattoos}
        renderItem={(tattoo) => (
          <TattooCard
            tattoo={tattoo}
            onImageClick={handleTattooClick}
            onArtistClick={handleArtistClick}
            onLikeToggle={handleLikeToggle}
          />
        )}
        onLoadMore={() => loadMore(mockLoadMore)}
        hasMore={hasMore}
        loading={loading}
        minColumnWidth={280}
        gap={16}
      />

      {/* Empty State */}
      {sortedTattoos.length === 0 && !loading && (
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
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun tatouage trouvé</h3>
          <p className="text-gray-500 mb-4">Essayez de modifier vos critères de recherche</p>
          <Button onClick={handleClearFilters} variant="outline">
            Effacer les filtres
          </Button>
        </div>
      )}

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={quickViewOpen}
        onClose={handleQuickViewClose}
        tattoo={selectedTattoo}
        onNext={handleQuickViewNext}
        onPrevious={handleQuickViewPrevious}
        hasNext={selectedIndex < sortedTattoos.length - 1}
        hasPrevious={selectedIndex > 0}
        onLikeToggle={handleLikeToggle}
        onArtistClick={handleArtistClick}
      />

      {/* Development Note */}
      <div className="mt-12 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Sprint 3 Développement:</strong> Quick View Modal intégré avec navigation clavier
          et tactile. Support complet pour mobile avec swipe gestures et interface responsive.
        </p>
      </div>
    </MainLayout>
  )
}

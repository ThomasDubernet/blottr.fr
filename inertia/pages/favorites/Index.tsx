import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { MainLayout } from '../../components/layout/MainLayout'
import { ArtistCard } from '../../components/discovery/ArtistCard'
import { TattooCard } from '../../components/discovery/TattooCard'
import { MasonryGrid, QuickViewModal } from '../../components/gallery'
import { Button } from '../../components/ui/Button'
import { useFavorites } from '../../hooks'

interface FavoritesIndexProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export default function FavoritesIndex({ user }: FavoritesIndexProps) {
  const { favorites, getFavoritesByType, clearAllFavorites, getFavoritesCount } = useFavorites()
  const [activeTab, setActiveTab] = useState<'all' | 'artists' | 'tattoos'>('all')
  const [quickViewOpen, setQuickViewOpen] = useState(false)
  const [selectedTattoo, setSelectedTattoo] = useState<any>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)

  const favoritesCount = getFavoritesCount()
  const artistFavorites = getFavoritesByType('artist')
  const tattooFavorites = getFavoritesByType('tattoo')

  // Convert favorite items back to component props format
  const convertedTattoos = tattooFavorites.map((fav) => ({
    id: fav.id,
    title: fav.title,
    imageUrl: fav.imageUrl || '',
    artist: {
      id: `artist-${fav.id}`,
      name: fav.artistName || 'Artiste',
      location: fav.location || 'France',
    },
    styles: ['Favori'],
    likes: 0,
    isLiked: false,
    description: `Ajouté aux favoris le ${new Date(fav.addedAt).toLocaleDateString('fr-FR')}`,
    createdAt: fav.addedAt,
  }))

  const convertedArtists = artistFavorites.map((fav) => ({
    id: fav.id,
    name: fav.title,
    location: fav.location || 'France',
    bio: `Ajouté aux favoris le ${new Date(fav.addedAt).toLocaleDateString('fr-FR')}`,
    styles: ['Artiste favori'],
    portfolioPreview: fav.imageUrl ? [fav.imageUrl] : undefined,
    rating: 5.0,
    reviewCount: 0,
    verified: true,
  }))

  const handleTattooClick = (tattoo: any) => {
    const index = convertedTattoos.findIndex((t) => t.id === tattoo.id)
    setSelectedTattoo(tattoo)
    setSelectedIndex(index)
    setQuickViewOpen(true)
  }

  const handleQuickViewClose = () => {
    setQuickViewOpen(false)
    setSelectedTattoo(null)
  }

  const handleQuickViewNext = () => {
    if (selectedIndex < convertedTattoos.length - 1) {
      const nextIndex = selectedIndex + 1
      setSelectedIndex(nextIndex)
      setSelectedTattoo(convertedTattoos[nextIndex])
    }
  }

  const handleQuickViewPrevious = () => {
    if (selectedIndex > 0) {
      const prevIndex = selectedIndex - 1
      setSelectedIndex(prevIndex)
      setSelectedTattoo(convertedTattoos[prevIndex])
    }
  }

  const handleArtistClick = (artistId: string) => {
    // Navigate to artist profile
    console.log('Navigate to artist:', artistId)
  }

  const handleLikeToggle = (tattooId: string) => {
    // Mock like toggle
    console.log('Toggle like for tattoo:', tattooId)
  }

  const handleClearAll = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer tous vos favoris ?')) {
      clearAllFavorites()
    }
  }

  const getFilteredFavorites = () => {
    switch (activeTab) {
      case 'artists':
        return { artists: convertedArtists, tattoos: [] }
      case 'tattoos':
        return { artists: [], tattoos: convertedTattoos }
      default:
        return { artists: convertedArtists, tattoos: convertedTattoos }
    }
  }

  const filteredFavorites = getFilteredFavorites()

  return (
    <MainLayout
      title="Mes Favoris - Blottr"
      description="Retrouvez tous vos artistes et tatouages favoris en un seul endroit"
      user={user}
    >
      <Head title="Mes Favoris - Blottr" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes favoris</h1>
        <p className="text-gray-600">
          {favoritesCount.total === 0
            ? "Vous n'avez pas encore de favoris"
            : `${favoritesCount.total} éléments sauvegardés`}
        </p>
      </div>

      {favorites.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 mb-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aucun favori pour le moment</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Découvrez des artistes incroyables et des tatouages inspirants, puis ajoutez-les à vos
            favoris pour les retrouver facilement.
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => (window.location.href = '/artists')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Découvrir des artistes
            </Button>
            <Button onClick={() => (window.location.href = '/tattoos')} variant="outline">
              Explorer la galerie
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tout ({favoritesCount.total})
              </button>
              <button
                onClick={() => setActiveTab('artists')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'artists'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Artistes ({favoritesCount.artists})
              </button>
              <button
                onClick={() => setActiveTab('tattoos')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'tattoos'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tatouages ({favoritesCount.tattoos})
              </button>
            </div>

            {/* Clear All Button */}
            <Button
              onClick={handleClearAll}
              variant="outline"
              size="sm"
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Vider les favoris
            </Button>
          </div>

          {/* Artists Grid */}
          {(activeTab === 'all' || activeTab === 'artists') &&
            filteredFavorites.artists.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Artistes favoris ({filteredFavorites.artists.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFavorites.artists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      artist={artist}
                      onClick={() => handleArtistClick(artist.id)}
                      showFavoriteButton={true}
                    />
                  ))}
                </div>
              </div>
            )}

          {/* Tattoos Grid */}
          {(activeTab === 'all' || activeTab === 'tattoos') &&
            filteredFavorites.tattoos.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Tatouages favoris ({filteredFavorites.tattoos.length})
                </h2>
                <MasonryGrid
                  items={filteredFavorites.tattoos}
                  renderItem={(tattoo) => (
                    <TattooCard
                      tattoo={tattoo}
                      onImageClick={handleTattooClick}
                      onArtistClick={handleArtistClick}
                      onLikeToggle={handleLikeToggle}
                      showFavoriteButton={true}
                    />
                  )}
                  minColumnWidth={280}
                  gap={16}
                />
              </div>
            )}

          {/* Quick View Modal */}
          <QuickViewModal
            isOpen={quickViewOpen}
            onClose={handleQuickViewClose}
            tattoo={selectedTattoo}
            onNext={handleQuickViewNext}
            onPrevious={handleQuickViewPrevious}
            hasNext={selectedIndex < convertedTattoos.length - 1}
            hasPrevious={selectedIndex > 0}
            onLikeToggle={handleLikeToggle}
            onArtistClick={handleArtistClick}
          />
        </>
      )}
    </MainLayout>
  )
}

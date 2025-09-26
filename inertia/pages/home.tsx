import React, { useState } from 'react'
import { Head, Link } from '@inertiajs/react'
import { MainLayout } from '../components/layout/MainLayout'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'
import { InteractiveMap, useInteractiveMap } from '../components/ui/InteractiveMap'
import { generateSampleArtists } from '../lib/utils'

interface HomeProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export default function Home({ user }: HomeProps) {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list')
  const mapHook = useInteractiveMap()
  const sampleArtists = generateSampleArtists()

  const handleArtistSelect = (artist: any) => {
    mapHook.selectArtist(artist)
  }

  return (
    <MainLayout
      title="Blottr - Trouvez le tatoueur parfait"
      description="Déniche les meilleurs tatoueurs pour votre prochain projet"
      user={user}
    >
      {/* Hero Section */}
      <div className="text-center py-24 bg-gray-100">
        <h1 className="text-6xl font-bold text-black mb-6 max-w-4xl mx-auto leading-tight">
          Trouvez le tatoueur parfait
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          Déniche les meilleurs tatoueurs pour votre prochain projet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/inscription">
            <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-full text-base font-medium hover:bg-gray-50 transition-colors">
              Créer un compte
            </button>
          </Link>
          <Link href="/tatoueurs">
            <button className="px-6 py-3 bg-black text-white rounded-full text-base font-medium hover:bg-gray-800 transition-colors">
              Découvrir
            </button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white py-8">
        {/* Search Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative max-w-2xl w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="Rechercher par style, artiste ou ville..."
            />
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            'Religieux',
            'Trash Polka', 
            'Polynésien',
            'Graphique',
            'Écriture',
            'Celtique',
            'Floral',
            'Witchy',
            'Mexicain',
            'Sketch',
            'Réaliste',
          ].map((style, index) => (
            <button
              key={style}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                index === 1 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              } rounded-full`}
            >
              {style}
            </button>
          ))}
        </div>

        {/* Results and View Toggle */}
        <div className="flex justify-between items-center px-4">
          <span className="text-sm text-gray-600">{sampleArtists.length} tatoueurs trouvés</span>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Carte
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Artist Results - Conditional Rendering */}
      <div className="bg-white py-8">
        {viewMode === 'map' ? (
          /* Map View */
          <div className="px-4">
            <InteractiveMap
              artists={sampleArtists}
              height="600px"
              onArtistSelect={handleArtistSelect}
              selectedArtist={mapHook.selectedArtist}
              center={mapHook.mapCenter}
              zoom={mapHook.mapZoom}
              className="w-full"
            />
          </div>
        ) : (
          /* List View */
          <div className="space-y-12">
            {sampleArtists.slice(0, 2).map((artist) => (
              <div key={artist.id} className="border-b border-gray-200 pb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {artist.stageName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-black">{artist.stageName}</h3>
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
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-gray-600">{artist.city.name}</p>
                        {artist.averageRating && (
                          <div className="flex items-center space-x-1 text-sm">
                            <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-gray-600">{artist.averageRating.toFixed(1)} ({artist.totalReviews})</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-2">
                        {artist.artStyles?.slice(0, 4).map((style, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 text-xs font-medium rounded-full">
                            {style}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>
                </div>

                {/* Portfolio Grid */}
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="aspect-square bg-gray-200 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer relative">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="absolute bottom-1 right-1 w-5 h-5 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">II</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Development Info */}
      <div className="mt-16 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Développement Sprint 1:</strong> React 19 × Inertia × TypeScript - Component
          Library Complete
        </p>
      </div>
    </MainLayout>
  )
}

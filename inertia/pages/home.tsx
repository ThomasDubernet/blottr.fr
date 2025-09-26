import React from 'react'
import { Head, Link } from '@inertiajs/react'
import { MainLayout } from '../components/layout/MainLayout'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/Card'

interface HomeProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export default function Home({ user }: HomeProps) {
  return (
    <MainLayout
      title="Blottr - Trouvez le tatoueur parfait"
      description="Déniche les meilleurs tatoueurs pour votre prochain projet"
      user={user}
    >
      {/* Hero Section */}
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">Trouvez le tatoueur parfait</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Déniche les meilleurs tatoueurs pour votre prochain projet
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register">
            <Button size="lg">Créer un compte</Button>
          </Link>
          <Link href="/tatoueurs">
            <Button variant="outline" size="lg">
              Découvrir
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Section */}
      <div className="mt-16 bg-white p-8 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-2 justify-center mb-6">
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
          ].map((style) => (
            <button
              key={style}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium transition-colors"
            >
              {style}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">2 tatoueurs trouvés</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Carte
            </Button>
            <Button variant="ghost" size="sm">
              Liste
            </Button>
          </div>
        </div>
      </div>

      {/* Featured Artists */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Artistes en vedette</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Mock artist cards */}
          {['Hervé', 'dju.mtl', 'Alex Pheles'].map((artist, index) => (
            <Card key={artist} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  Portfolio {artist}
                </div>
              </div>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full" />
                    <div>
                      <CardTitle className="text-base">{artist}</CardTitle>
                      <CardDescription>Serrafine</CardDescription>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">Trash Polka</span>
                  <span className="px-2 py-1 bg-gray-100 text-xs rounded">Neo-traditional</span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
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

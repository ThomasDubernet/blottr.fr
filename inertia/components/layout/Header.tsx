import React from 'react'
import { Link } from '@tuyau/inertia/react'
import { Button } from '../ui/Button'

interface HeaderProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <Link route="accueil" className="flex items-center">
          <span className="text-2xl font-bold text-black">Blottr</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/tatoueurs">
            <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
              Explorer
            </button>
          </Link>
          <Link
            href="/tatouages"
            className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
          >
            Tatouages
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link route="auth.logout" method="post" as="button">
                <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Déconnexion
                </button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                route="connexion"
                className="text-sm font-medium text-gray-700 hover:text-black transition-colors"
              >
                Se connecter
              </Link>
              <Link route="inscription">
                <button className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">
                  Commencer
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden p-2">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  )
}

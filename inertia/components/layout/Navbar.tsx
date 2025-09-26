import React from 'react'
import { Link } from '@inertiajs/react'

interface NavbarProps {
  currentPage?: 'connexion' | 'inscription' | 'home' | 'default'
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export function Navbar({ currentPage = 'default', user }: NavbarProps) {
  const isAuthPage = currentPage === 'connexion' || currentPage === 'inscription'
  
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-bold text-black">
          Blottr
        </Link>
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Explorer
          </Link>
          <Link 
            href="/tatouages" 
            className="text-gray-700 hover:text-black text-sm font-medium transition-colors"
          >
            Tatouages
          </Link>
        </nav>
      </div>
      
      <div className="flex items-center space-x-4">
        {user ? (
          // Authenticated user state
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Link href="/logout" method="post" as="button">
              <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                Déconnexion
              </button>
            </Link>
          </div>
        ) : (
          // Guest user state
          <div className="flex items-center space-x-4">
            {currentPage === 'connexion' ? (
              <span className="text-gray-700 text-sm">Se connecter</span>
            ) : (
              <Link 
                href="/connexion" 
                className="text-gray-700 hover:text-black text-sm font-medium transition-colors"
              >
                Se connecter
              </Link>
            )}
            
            {currentPage === 'inscription' ? (
              <span className="text-gray-700 text-sm">Inscription</span>
            ) : (
              <Link 
                href="/inscription" 
                className="px-4 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Commencer
              </Link>
            )}
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
    </header>
  )
}
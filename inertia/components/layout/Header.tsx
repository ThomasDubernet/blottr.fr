import React from 'react'
import { Link } from '@inertiajs/react'
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
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-gray-900">Blottr</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/tatoueurs"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Explorer
          </Link>
          <Link
            href="/tatouages"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Tatouages
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Button variant="outline" size="sm">
                <Link href="/logout" method="post" as="button">
                  Déconnexion
                </Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Se connecter
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Commencer</Button>
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

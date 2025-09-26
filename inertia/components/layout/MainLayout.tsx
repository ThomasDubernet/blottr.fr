import React from 'react'
import { Head } from '@inertiajs/react'
import { Header } from './Header'

interface MainLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
}

export function MainLayout({
  children,
  title = 'Blottr',
  description = 'Trouvez le tatoueur parfait',
  user,
}: MainLayoutProps) {
  return (
    <>
      <Head title={title}>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header user={user} />

        <main className="container mx-auto px-4 py-8">{children}</main>

        <footer className="border-t bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <span className="text-xl font-bold text-gray-900">Blottr</span>
                <span className="text-sm text-gray-500">© 2025 Tous droits réservés</span>
              </div>

              <nav className="flex space-x-6">
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  À propos
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Contact
                </a>
                <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                  Mentions légales
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

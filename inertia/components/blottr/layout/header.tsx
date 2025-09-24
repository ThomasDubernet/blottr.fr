import React from 'react'
import { Link, router } from '@inertiajs/react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'

interface User {
  id: string
  email: string
  role: number
}

interface HeaderProps {
  className?: string
  user?: User | null
}

export function Header({ className, user }: HeaderProps) {
  const handleLogout = () => {
    router.post('/logout')
  }
  return (
    <header
      className={cn(
        'border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        className
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">B</span>
          </div>
          <span className="font-bold text-xl text-foreground">Blottr</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            href="/artists"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Artistes
          </Link>
          <Link
            href="/salons"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Salons
          </Link>
          <Link
            href="/styles"
            className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
          >
            Styles
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {user ? (
            // Authenticated user actions
            <>
              <span className="text-sm text-foreground/60 hidden md:inline">
                Bonjour, {user.email}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            // Guest user actions
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Connexion</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/register">Inscription</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

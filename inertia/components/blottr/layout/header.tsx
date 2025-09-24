import React from 'react'
import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui'
import { cn } from '~/lib/utils'

interface HeaderProps {
  className?: string
}

export function Header({ className }: HeaderProps) {
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
          <Button variant="ghost" size="sm">
            Connexion
          </Button>
          <Button size="sm">Inscription</Button>
        </div>
      </div>
    </header>
  )
}

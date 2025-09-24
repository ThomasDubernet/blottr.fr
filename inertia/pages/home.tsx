import { Head } from '@inertiajs/react'
import { Header } from '@/components/blottr/layout/header'
import { Button } from '@/components/ui'

export default function Home() {
  return (
    <>
      <Head title="Blottr - Découvrez les meilleurs artistes tatoueurs" />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-flash/10 py-20">
          <div className="container">
            <div className="mx-auto max-w-4xl text-center">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Trouvez l'artiste tatoueur
                <span className="block text-primary">parfait pour vous</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Découvrez des artistes tatoueurs vérifiés, explorez leurs portfolios uniques et
                réservez votre prochain tatouage en toute confiance.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg" className="px-8">
                  Explorer les artistes
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Devenir artiste
                </Button>
              </div>
            </div>
          </div>

          {/* Background Pattern */}
          <div className="absolute inset-0 -z-10 bg-dots opacity-20" />
        </section>

        {/* Featured Artists Section */}
        <section className="py-16">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Artistes en vedette</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Découvrez le travail exceptionnel de nos artistes vérifiés
              </p>
            </div>

            {/* Placeholder for artist grid */}
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-card p-6 shadow-soft hover:shadow-medium transition-shadow"
                >
                  <div className="aspect-square w-full rounded-lg bg-muted animate-pulse" />
                  <div className="mt-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-3 bg-muted/70 rounded animate-pulse w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <div className="container">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">Pourquoi choisir Blottr ?</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                La plateforme de référence pour vos projets de tatouage
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-verified/10">
                  <svg
                    className="h-6 w-6 text-verified-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Artistes vérifiés</h3>
                <p className="mt-2 text-muted-foreground">
                  Tous nos artistes sont vérifiés et certifiés pour garantir la qualité
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-info/10">
                  <svg className="h-6 w-6 text-info-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Portfolios complets</h3>
                <p className="mt-2 text-muted-foreground">
                  Explorez les créations et styles de chaque artiste en détail
                </p>
              </div>

              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <svg className="h-6 w-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Contact direct</h3>
                <p className="mt-2 text-muted-foreground">
                  Échangez directement avec les artistes pour vos projets
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-muted/30 py-8">
          <div className="container">
            <div className="text-center">
              <p className="text-muted-foreground">
                © 2025 Blottr. Plateforme de mise en relation avec les artistes tatoueurs.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

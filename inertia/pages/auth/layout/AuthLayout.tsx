import React from 'react'
import { Head } from '@inertiajs/react'

interface AuthLayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export function AuthLayout({
  children,
  title = 'Blottr',
  description = 'Trouvez le tatoueur parfait',
}: AuthLayoutProps) {
  return (
    <>
      <Head title={title}>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-gray-50">{children}</div>
    </>
  )
}

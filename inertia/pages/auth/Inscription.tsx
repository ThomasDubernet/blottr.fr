import { FormEvent } from 'react'
import { Link, useForm } from '@inertiajs/react'
import { MainLayout } from '~/components/layout/MainLayout'

interface InscriptionForm {
  email: string
  password: string
  role: 'client' | 'artist'
}

export default function Inscription() {
  const { data, setData, post, processing, errors } = useForm<InscriptionForm>({
    email: '',
    password: '',
    role: 'client',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/inscription')
  }

  const handleArtistSignup = () => {
    setData('role', 'artist')
    // Could redirect to artist-specific signup flow
  }

  return (
    <MainLayout title="Inscription - Blottr" description="Accède à 3000+ tatoueurs">
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Main Heading */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black mb-2">
              Accède à 3000+
              <br />
              tatoueurs
            </h1>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6 mb-8">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Adresse email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={processing}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Création...' : 'Créer mon compte'}
            </button>
          </form>

          {/* Artist Onboarding Section */}
          <div className="border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-shrink-0">
                {/* Tattoo Artist Illustration */}
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-1">Tu es tatoueur ?</h3>
                <p className="text-sm text-gray-600">
                  Gagne en visibilité et organise ton activité simplement.
                </p>
              </div>
            </div>
            <button
              onClick={handleArtistSignup}
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-medium text-base hover:bg-gray-800 transition-colors"
            >
              Commencer
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">Déjà membre ?</p>
            <Link href="/login">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-medium text-base hover:bg-gray-200 transition-colors">
                Se connecter
              </button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

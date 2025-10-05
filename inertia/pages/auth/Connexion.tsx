import React, { FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { Navbar } from '../../components/layout/Navbar'
import { FlashMessage } from '../../components/FlashMessage'

interface ConnexionForm {
  email: string
  password: string
}

export default function Connexion() {
  const { data, setData, post, processing, errors } = useForm<ConnexionForm>({
    email: '',
    password: '',
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/connexion')
  }

  return (
    <>
      <Head title="Connexion - Blottr" />
      <FlashMessage />

      <div className="min-h-screen bg-white">
        <Navbar currentPage="connexion" />

        {/* Main Content */}
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-black mb-4">Connexion</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Connexion...' : 'Connexion'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-4">
                Vous n'avez pas de compte ?
              </p>
              <Link
                href="/inscription"
                className="w-full block py-3 px-4 bg-gray-100 text-black rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
              >
                Inscription
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
import React, { FormEvent, useState } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

interface RegisterForm {
  email: string
  password: string
  passwordConfirmation: string
  role: 'client' | 'artist'
}

export default function Register() {
  const { data, setData, post, processing, errors } = useForm<RegisterForm>({
    email: '',
    password: '',
    passwordConfirmation: '',
    role: 'client'
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <>
      <Head title="Inscription - Blottr" />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Blottr
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Accède à 3000+ tatoueurs
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Déniche les meilleurs tatoueurs pour votre prochain projet
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Créer un compte</CardTitle>
              <CardDescription>
                Commencez votre recherche dès maintenant
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Email"
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  error={errors.email}
                  placeholder="Adresse email"
                  required
                />

                <Input
                  label="Mot de passe"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  error={errors.password}
                  placeholder="Mot de passe"
                  required
                />

                <Input
                  label="Confirmer le mot de passe"
                  type="password"
                  value={data.passwordConfirmation}
                  onChange={(e) => setData('passwordConfirmation', e.target.value)}
                  error={errors.passwordConfirmation}
                  placeholder="Confirmer le mot de passe"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  loading={processing}
                >
                  Créer mon compte
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">ou</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">
                        Tu es tatoueur ?
                      </h3>
                      <p className="text-sm text-gray-500">
                        Gagne en visibilité et organise ton activité simplement.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      variant="outline"
                      fullWidth
                      onClick={() => setData('role', 'artist')}
                    >
                      Commencer
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Déjà membre ?{' '}
                  <Link
                    href="/login"
                    className="font-medium text-gray-900 hover:text-gray-700"
                  >
                    Se connecter
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
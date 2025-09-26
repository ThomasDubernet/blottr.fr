import React, { FormEvent } from 'react'
import { Head, useForm, Link } from '@inertiajs/react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

interface LoginForm {
  email: string
  password: string
  remember: boolean
}

export default function Login() {
  const { data, setData, post, processing, errors } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <>
      <Head title="Connexion - Blottr" />

      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <Link href="/" className="text-3xl font-bold text-gray-900">
              Blottr
            </Link>
            <h2 className="mt-6 text-2xl font-bold text-gray-900">Connexion</h2>
            <p className="mt-2 text-sm text-gray-600">Connectez-vous à votre compte</p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Se connecter</CardTitle>
              <CardDescription>Accédez à votre compte Blottr</CardDescription>
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

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="h-4 w-4 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                      Se souvenir de moi
                    </label>
                  </div>

                  <div className="text-sm">
                    <a href="#" className="font-medium text-gray-600 hover:text-gray-500">
                      Mot de passe oublié ?
                    </a>
                  </div>
                </div>

                <Button type="submit" fullWidth loading={processing}>
                  Connexion
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Vous n'avez pas de compte ?{' '}
                  <Link href="/register" className="font-medium text-gray-900 hover:text-gray-700">
                    Inscription
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

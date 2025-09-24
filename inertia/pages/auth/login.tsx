import { useForm } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'

interface LoginData {
  email: string
  password: string
}

interface LoginProps {
  errors?: Record<string, string>
}

export default function Login({ errors = {} }: LoginProps) {
  const { data, setData, post, processing } = useForm<LoginData>({
    email: '',
    password: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
          <CardDescription>
            Accédez à votre compte client Blottr
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="votre@email.fr"
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="••••••••"
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? 'Connexion...' : 'Se connecter'}
            </Button>

            <p className="text-sm text-center text-gray-600">
              Pas encore de compte ?{' '}
              <a
                href="/register"
                className="text-blue-600 hover:underline"
              >
                Créer un compte
              </a>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
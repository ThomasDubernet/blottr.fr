import { useForm, Head, Link } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Header } from '@/components/blottr/layout/header'
import { DebugCard } from '@/components/blottr'

interface RegisterData {
  email: string
  password: string
  password_confirmation: string
}

interface User {
  id: string
  email: string
  role: number
}

interface RegisterProps {
  auth: {
    user: User | null
  }
  errors?: Record<string, string>
}

export default function Register({ auth, errors = {} }: RegisterProps) {
  const { data, setData, post, processing } = useForm<RegisterData>({
    email: '',
    password: '',
    password_confirmation: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/register')
  }

  return (
    <>
      <Head title="Inscription - Blottr" />
      <div className="min-h-screen bg-background">
        <Header user={auth.user} />
        <div className="flex items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez Blottr pour découvrir les meilleurs artistes tatoueurs
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
              <p className="text-xs text-muted-foreground">
                Minimum 8 caractères
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
              <Input
                id="password_confirmation"
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={processing}
            >
              {processing ? 'Création...' : 'Créer mon compte'}
            </Button>

            <p className="text-sm text-center text-muted-foreground">
              Déjà un compte ?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
        </div>

        {/* Debug Card - Only shows in development when DEBUG=true */}
        <DebugCard user={auth.user} />
      </div>
    </>
  )
}
import type { HttpContext } from '@adonisjs/core/http'

export default class HomeController {
  async index({ auth, inertia }: HttpContext) {
    // Silently check if user is authenticated
    await auth.check()

    // Get authenticated user if exists
    const user = auth.user
      ? {
          id: auth.user.id,
          email: auth.user.email,
          role: auth.user.isClient ? ('client' as const) : ('artist' as const),
        }
      : null

    return inertia.render('home', { user })
  }
}

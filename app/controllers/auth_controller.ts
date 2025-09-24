import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { loginValidator } from '#validators/login'
import { registerValidator } from '#validators/register'

export default class AuthController {
  /**
   * Show login form
   */
  async showLogin({ inertia }: HttpContext) {
    return inertia.render('auth/login')
  }

  /**
   * Show register form
   */
  async showRegister({ inertia }: HttpContext) {
    return inertia.render('auth/register')
  }

  /**
   * Handle login attempt
   */
  async login({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)

    // Only allow clients (role=1) to login for now
    if (user.role !== 1) {
      session.flash('errors', { email: 'Seuls les clients peuvent se connecter pour le moment.' })
      return response.redirect().back()
    }

    await auth.use('web').login(user)

    // Update last login
    user.lastLoginAt = new Date()
    await user.save()

    return response.redirect().toRoute('home')
  }

  /**
   * Handle registration
   */
  async register({ auth, request, response, session }: HttpContext) {
    const { email, password } = await request.validateUsing(registerValidator)

    // Check if user already exists
    const existingUser = await User.findBy('email', email)
    if (existingUser) {
      session.flash('errors', { email: 'Un compte avec cet email existe déjà.' })
      return response.redirect().back()
    }

    // Create new client user
    const user = await User.create({
      email,
      password,
      role: 1, // Client role
      tattooViewCount: 0,
      artistContactCount: 0,
    })

    await auth.use('web').login(user)

    return response.redirect().toRoute('home')
  }

  /**
   * Handle logout
   */
  async logout({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect().toRoute('auth.login')
  }
}
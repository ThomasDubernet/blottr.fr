import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { registerValidator, loginValidator } from '#validators/auth'
import RegisterUserUseCase from '#use_cases/register_user_use_case'
import LoginUserUseCase from '#use_cases/login_user_use_case'
import { AUTH_ERRORS, SUCCESS_MESSAGES } from '#constants/error_messages'

export default class AuthController {
  /**
   * Register a new user
   */
  async register({ request, response, auth, session }: HttpContext) {
    // Validate request data
    const payload = await request.validateUsing(registerValidator)

    // Execute use case
    const useCase = new RegisterUserUseCase()
    const result = await useCase.execute(payload)

    // Find user for authentication
    const user = await User.find(result.userId)

    if (!user) {
      return response.abort({ message: AUTH_ERRORS.USER_NOT_FOUND_AFTER_CREATION }, 500)
    }

    // Authenticate the user
    await auth.use('web').login(user)

    // Flash success message
    session.flash('success', SUCCESS_MESSAGES.REGISTRATION_SUCCESS)

    // Redirect to login page
    return response.redirect('/connexion')
  }

  /**
   * Login an existing user
   */
  async login({ request, response, auth, session }: HttpContext) {
    // Validate request data
    const payload = await request.validateUsing(loginValidator)

    try {
      // Execute use case
      const useCase = new LoginUserUseCase()
      const result = await useCase.execute(payload)

      // Find user for authentication
      const user = await User.find(result.userId)

      if (!user) {
        return response.abort({ message: AUTH_ERRORS.USER_NOT_FOUND }, 500)
      }

      // Authenticate the user
      await auth.use('web').login(user)

      // Redirect to home page
      return response.redirect('/')
    } catch (error) {
      // Handle authentication errors gracefully with flash message
      if (error.code === 'E_INVALID_CREDENTIALS') {
        session.flash('error', 'Email ou mot de passe incorrect')
        return response.redirect().back()
      }

      if (error.code === 'E_ACCOUNT_DEACTIVATED') {
        session.flash('error', 'Votre compte a été désactivé')
        return response.redirect().back()
      }

      // Re-throw unexpected errors
      throw error
    }
  }

  /**
   * Logout the authenticated user
   */
  async logout({ response, auth }: HttpContext) {
    await auth.use('web').logout()
    return response.redirect('/')
  }
}

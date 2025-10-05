import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import type { LoginUserInput, LoginUserOutput } from './dtos/login_user_dto.js'
import { Exception } from '@adonisjs/core/exceptions'
import { AUTH_ERRORS } from '#constants/error_messages'

/**
 * Use Case: Authenticate an existing user
 *
 * Business rules:
 * - User must exist with provided email
 * - Password must match stored hash
 * - User account must be active
 * - Update last login timestamp on successful login
 *
 * @throws Exception with status 400 if credentials are invalid
 * @throws Exception with status 403 if account is deactivated
 */
export default class LoginUserUseCase {
  async execute(input: LoginUserInput): Promise<LoginUserOutput> {
    // Find user by email
    const user = await User.findByEmail(input.email)

    if (!user) {
      throw new Exception(AUTH_ERRORS.INVALID_CREDENTIALS, {
        status: 400,
        code: 'E_INVALID_CREDENTIALS',
      })
    }

    // Verify password
    const isPasswordValid = await hash.verify(user.password, input.password)

    if (!isPasswordValid) {
      throw new Exception(AUTH_ERRORS.INVALID_CREDENTIALS, {
        status: 400,
        code: 'E_INVALID_CREDENTIALS',
      })
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Exception(AUTH_ERRORS.ACCOUNT_DEACTIVATED, {
        status: 403,
        code: 'E_ACCOUNT_DEACTIVATED',
      })
    }

    // Update last login timestamp
    await user.updateLastLogin()

    // Return clean DTO output
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      lastLoginAt: user.lastLoginAt,
    }
  }
}

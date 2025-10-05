import User, { UserRole } from '#models/user'
import type { RegisterUserInput, RegisterUserOutput } from './dtos/register_user_dto.js'

/**
 * Use Case: Register a new user
 *
 * Business rules:
 * - Email must be unique (validated by validator)
 * - Password must meet security requirements (validated by validator)
 * - User is created as active but not email verified
 * - Role can be either client or artist
 */
export default class RegisterUserUseCase {
  async execute(input: RegisterUserInput): Promise<RegisterUserOutput> {
    // Map role string to UserRole enum
    const role = input.role === 'artist' ? UserRole.ARTIST : UserRole.CLIENT

    // Create user with hashed password (Lucid hook handles hashing)
    const user = await User.create({
      email: input.email,
      password: input.password,
      role,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
    })

    // Return clean DTO output
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    }
  }
}

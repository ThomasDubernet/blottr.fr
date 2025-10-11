import vine from '@vinejs/vine'
import { SimpleMessagesProvider } from '@vinejs/vine'
import { VALIDATION_ERRORS } from '#constants/error_messages'

/**
 * Custom error messages for password validation
 */
const passwordMessages = {
  'password.minLength': VALIDATION_ERRORS.PASSWORD_MIN_LENGTH,
  'password.regex': VALIDATION_ERRORS.PASSWORD_PATTERN,
}

/**
 * Validator for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email().normalizeEmail().unique({
      table: 'users',
      column: 'email',
    }),
    password: vine
      .string()
      .minLength(8)
      .maxLength(255)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
    role: vine.enum(['client', 'artist']),
  })
)

// Apply custom messages to the validator
registerValidator.messagesProvider = new SimpleMessagesProvider(passwordMessages)

/**
 * Validator for user login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().toLowerCase().email().normalizeEmail(),
    password: vine.string(),
  })
)

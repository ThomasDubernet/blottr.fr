import vine from '@vinejs/vine'

/**
 * Validates the payload for user registration
 */
export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).confirmed(),
  })
)

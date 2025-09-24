import vine from '@vinejs/vine'

/**
 * Validates the payload for user login
 */
export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8)
  })
)
import vine from '@vinejs/vine'

/**
 * Validates the contact inquiry creation payload
 */
export const createContactInquiryValidator = vine.compile(
  vine.object({
    // Required fields
    fullName: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().normalizeEmail(),
    subject: vine.string().trim().minLength(5).maxLength(200),
    message: vine.string().trim().minLength(10).maxLength(2000),
    projectType: vine.enum(['consultation', 'quote', 'appointment', 'question']),

    // Optional contact fields
    phone: vine
      .string()
      .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)
      .optional(),

    // Optional project details
    budget: vine.string().maxLength(50).optional(),
    preferredDate: vine.string().maxLength(100).optional(),
    location: vine.string().maxLength(200).optional(),
    size: vine.enum(['small', 'medium', 'large', 'full-sleeve', 'full-back']).optional(),
    placement: vine.string().maxLength(100).optional(),
    hasExistingTattoos: vine.boolean().optional(),

    // Array fields
    tattooStyles: vine.array(vine.string()).optional(),

    // Relationship fields
    artistId: vine.string().uuid().optional(),
    tattooId: vine.string().uuid().optional(),

    // File uploads (handled separately in controller)
    referenceImageCount: vine.number().min(0).max(5).optional(),
  })
)

/**
 * Validates quick inquiry payload
 */
export const createQuickInquiryValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(100),
    email: vine.string().email().normalizeEmail(),
    message: vine.string().trim().minLength(10).maxLength(1000),
    artistId: vine.string().uuid().optional(),
    tattooId: vine.string().uuid().optional(),
  })
)

/**
 * Validates inquiry status update
 */
export const updateInquiryStatusValidator = vine.compile(
  vine.object({
    status: vine.enum(['pending', 'in_progress', 'replied', 'closed', 'spam']),
    priority: vine.number().min(1).max(10).optional(),
  })
)

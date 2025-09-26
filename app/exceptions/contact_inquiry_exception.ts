import { Exception } from '@adonisjs/core/exceptions'
import { HttpContext } from '@adonisjs/core/http'

export class ContactInquiryValidationException extends Exception {
  static status = 422
  static code = 'E_CONTACT_INQUIRY_VALIDATION'

  constructor(message: string, options?: any) {
    super(message, { status: 422, code: 'E_CONTACT_INQUIRY_VALIDATION', ...options })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.status(422).json({
      success: false,
      message: error.message,
      code: error.code,
      errors: error.cause || {},
    })
  }
}

export class ContactInquiryNotFoundException extends Exception {
  static status = 404
  static code = 'E_CONTACT_INQUIRY_NOT_FOUND'

  constructor(inquiryId: string) {
    super(`Contact inquiry with ID "${inquiryId}" not found`, {
      status: 404,
      code: 'E_CONTACT_INQUIRY_NOT_FOUND',
    })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.status(404).json({
      success: false,
      message: error.message,
      code: error.code,
    })
  }
}

export class FileUploadException extends Exception {
  static status = 400
  static code = 'E_FILE_UPLOAD_ERROR'

  constructor(message: string, originalError?: Error) {
    super(message, {
      status: 400,
      code: 'E_FILE_UPLOAD_ERROR',
      cause: originalError?.message,
    })
  }

  async handle(error: this, ctx: HttpContext) {
    return ctx.response.status(400).json({
      success: false,
      message: error.message,
      code: error.code,
      details: error.cause,
    })
  }
}

export class EmailDeliveryException extends Exception {
  static status = 500
  static code = 'E_EMAIL_DELIVERY_ERROR'

  constructor(email: string, originalError?: Error) {
    super(`Failed to send email to ${email}`, {
      status: 500,
      code: 'E_EMAIL_DELIVERY_ERROR',
      cause: originalError?.message,
    })
  }

  async handle(error: this, ctx: HttpContext) {
    // Log error for monitoring but don't expose internal details
    console.error('Email delivery failed:', {
      error: error.message,
      cause: error.cause,
      timestamp: new Date().toISOString(),
      requestId: ctx.request.id(),
    })

    return ctx.response.status(500).json({
      success: false,
      message: 'Unable to send notification email. Your inquiry was saved successfully.',
      code: error.code,
    })
  }
}
import type { HttpContext } from '@adonisjs/core/http'
import {
  createContactInquiryValidator,
  createQuickInquiryValidator,
} from '#validators/contact_inquiry'
import ContactInquiry from '#models/contact_inquiry'
import Artist from '#models/artist'
import { InquiryStatus, InquirySource, ProjectType } from '#models/contact_inquiry'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'
import { monitoringService } from '#services/monitoring_service'
import { ContactInquiryNotFoundException } from '#exceptions/contact_inquiry_exception'

export default class ContactInquiriesController {
  /**
   * Handle contact inquiry form submission
   */
  async store({ request, response }: HttpContext) {
    const startTime = Date.now()
    try {
      // Validate the request data
      const payload = await request.validateUsing(createContactInquiryValidator)

      // Handle file uploads
      const referenceImages: string[] = []
      const uploadedFiles = request.files('referenceImages', {
        size: '5mb',
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      })

      if (uploadedFiles && uploadedFiles.length > 0) {
        for (const file of uploadedFiles) {
          if (file.isValid) {
            const fileName = `${cuid()}.${file.extname}`
            await file.move(app.makePath('storage/uploads/inquiries'), {
              name: fileName,
            })
            referenceImages.push(`uploads/inquiries/${fileName}`)
          }
        }
      }

      // Verify artist exists if artistId provided
      let artist: Artist | null = null
      if (payload.artistId) {
        artist = await Artist.find(payload.artistId)
        if (!artist) {
          return response.badRequest({
            success: false,
            message: 'Artiste non trouvé',
          })
        }
      }

      // Create the contact inquiry
      const inquiry = await ContactInquiry.create({
        ...payload,
        projectType: payload.projectType as ProjectType,
        referenceImages: referenceImages.length > 0 ? referenceImages : null,
        status: InquiryStatus.PENDING,
        source: InquirySource.WEBSITE,
        ipAddress: request.ip(),
        userAgent: request.header('user-agent'),
      })

      // Send notification email to artist
      if (artist?.user) {
        await this.sendArtistNotification(inquiry, artist)
      }

      // Record monitoring metrics
      const responseTime = Date.now() - startTime
      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode: 201,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      return response.created({
        success: true,
        message:
          "Votre demande a été envoyée avec succès ! L'artiste vous contactera dans les plus brefs délais.",
        inquiryId: inquiry.id,
      })
    } catch (error) {
      // Record error metrics
      const responseTime = Date.now() - startTime
      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode: 400,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      monitoringService.logError(error, {
        endpoint: request.url(),
        method: request.method(),
        ipAddress: request.ip(),
      })

      console.error('Contact inquiry creation error:', error)
      return response.badRequest({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
      })
    }
  }

  /**
   * Handle quick inquiry (simplified form)
   */
  async storeQuick({ request, response }: HttpContext) {
    try {
      const payload = await request.validateUsing(createQuickInquiryValidator)
      const { name, email, message, artistId, tattooId } = payload

      // Basic validation
      if (!name || !email || !message) {
        return response.badRequest({
          success: false,
          message: 'Nom, email et message sont requis',
        })
      }

      // Create simplified inquiry
      const inquiry = await ContactInquiry.create({
        fullName: name,
        email,
        subject: 'Demande rapide',
        message,
        projectType: ProjectType.QUESTION,
        artistId,
        tattooId,
        status: InquiryStatus.PENDING,
        source: InquirySource.QUICK_FORM,
        ipAddress: request.ip(),
        userAgent: request.header('user-agent'),
      })

      return response.created({
        success: true,
        message: 'Votre message a été envoyé avec succès !',
        inquiryId: inquiry.id,
      })
    } catch (error) {
      console.error('Quick inquiry creation error:', error)
      return response.badRequest({
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre message.",
      })
    }
  }

  /**
   * Get inquiry by ID (for confirmation pages)
   */
  async show({ params, request, response }: HttpContext) {
    const startTime = Date.now()
    try {
      const inquiry = await ContactInquiry.find(params.id)

      if (!inquiry) {
        throw new ContactInquiryNotFoundException(params.id)
      }

      // Record monitoring metrics
      const responseTime = Date.now() - startTime
      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode: 200,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      return response.ok({
        success: true,
        inquiry: {
          id: inquiry.id,
          status: inquiry.status,
          createdAt: inquiry.createdAt,
          subject: inquiry.subject,
          fullName: inquiry.fullName,
          email: inquiry.email,
          projectType: inquiry.projectType,
          timeAgo: inquiry.timeAgo,
          priorityLabel: inquiry.priorityLabel,
        },
      })
    } catch (error) {
      if (error instanceof ContactInquiryNotFoundException) {
        throw error
      }

      // Record error metrics
      const responseTime = Date.now() - startTime
      monitoringService.recordApiMetric({
        endpoint: request.url(),
        method: request.method(),
        responseTime,
        statusCode: 500,
        userAgent: request.header('user-agent'),
        ipAddress: request.ip(),
      })

      monitoringService.logError(error, {
        endpoint: '/contact-inquiries/:id',
        inquiryId: params.id,
      })

      return response.status(500).json({
        success: false,
        message: 'Une erreur est survenue lors de la récupération de la demande',
      })
    }
  }

  /**
   * Send notification email to artist
   */
  private async sendArtistNotification(inquiry: ContactInquiry, artist: Artist) {
    // TODO: Implement email service integration
    // This would integrate with a service like Mailgun, SendGrid, or SES
    console.log(
      `Notification email would be sent to artist ${artist.stageName} for inquiry ${inquiry.id}`
    )

    // Log inquiry details for now
    console.log('Inquiry details:', {
      from: inquiry.email,
      name: inquiry.fullName,
      subject: inquiry.subject,
      projectType: inquiry.projectType,
      artistId: artist.id,
    })
  }

  /**
   * Health check endpoint
   */
  async health({ response }: HttpContext) {
    try {
      const healthCheck = await monitoringService.getHealthCheck()

      const statusCode =
        healthCheck.status === 'healthy' ? 200 : healthCheck.status === 'degraded' ? 200 : 503

      return response.status(statusCode).json({
        service: 'contact_inquiries',
        ...healthCheck,
      })
    } catch (error) {
      monitoringService.logError(error, { endpoint: '/health/contact-inquiries' })

      return response.status(503).json({
        service: 'contact_inquiries',
        status: 'unhealthy',
        message: 'Health check failed',
        timestamp: new Date().toISOString(),
      })
    }
  }
}

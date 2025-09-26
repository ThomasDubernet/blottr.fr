import { ContactInquiry } from '../components/forms'

export interface FormSubmissionResult {
  success: boolean
  message: string
  inquiryId?: string
}

export class FormService {
  private static instance: FormService
  private baseUrl: string

  private constructor() {
    this.baseUrl = '/api/forms'
  }

  public static getInstance(): FormService {
    if (!FormService.instance) {
      FormService.instance = new FormService()
    }
    return FormService.instance
  }

  async submitContactInquiry(
    inquiry: ContactInquiry,
    artistId?: string
  ): Promise<FormSubmissionResult> {
    try {
      // Create FormData for file uploads
      const formData = new FormData()

      // Add basic form fields
      formData.append('name', inquiry.name)
      formData.append('email', inquiry.email)
      formData.append('subject', inquiry.subject)
      formData.append('message', inquiry.message)
      formData.append('projectType', inquiry.projectType)

      // Add optional fields
      if (inquiry.phone) formData.append('phone', inquiry.phone)
      if (inquiry.budget) formData.append('budget', inquiry.budget)
      if (inquiry.preferredDate) formData.append('preferredDate', inquiry.preferredDate)
      if (inquiry.location) formData.append('location', inquiry.location)
      if (inquiry.placement) formData.append('placement', inquiry.placement)
      if (inquiry.size) formData.append('size', inquiry.size)
      if (artistId) formData.append('artistId', artistId)

      // Add array fields
      if (inquiry.tattooStyle && inquiry.tattooStyle.length > 0) {
        formData.append('tattooStyles', JSON.stringify(inquiry.tattooStyle))
      }

      // Add boolean fields
      formData.append('hasExistingTattoos', inquiry.hasExistingTattoos.toString())

      // Add reference images
      if (inquiry.referenceImages && inquiry.referenceImages.length > 0) {
        inquiry.referenceImages.forEach((file, index) => {
          formData.append(`referenceImage_${index}`, file)
        })
        formData.append('referenceImageCount', inquiry.referenceImages.length.toString())
      }

      // For now, simulate API call with timeout
      // In production, this would be a real API endpoint
      await this.simulateApiCall()

      // Mock successful response
      return {
        success: true,
        message:
          "Votre demande a été envoyée avec succès ! L'artiste vous contactera dans les plus brefs délais.",
        inquiryId: `INQ_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    } catch (error) {
      console.error('Form submission error:', error)
      return {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
      }
    }
  }

  async submitQuickInquiry(data: {
    name: string
    email: string
    message: string
    artistId?: string
    tattooId?: string
  }): Promise<FormSubmissionResult> {
    try {
      // Simulate API call
      await this.simulateApiCall()

      return {
        success: true,
        message: 'Votre message a été envoyé avec succès !',
        inquiryId: `QUICK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    } catch (error) {
      console.error('Quick inquiry submission error:', error)
      return {
        success: false,
        message: "Une erreur est survenue lors de l'envoi de votre message.",
      }
    }
  }

  async validateEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  async validatePhone(phone: string): Promise<boolean> {
    // French phone number validation
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  }

  private async simulateApiCall(): Promise<void> {
    // Simulate network delay
    const delay = Math.random() * 1000 + 500 // 500-1500ms
    await new Promise((resolve) => setTimeout(resolve, delay))

    // Simulate occasional errors (5% failure rate)
    if (Math.random() < 0.05) {
      throw new Error('Simulated network error')
    }
  }

  // Email template generation for notifications
  generateEmailTemplate(inquiry: ContactInquiry, artistName?: string): string {
    return `
      <h2>Nouvelle demande de contact - Blottr</h2>

      <h3>Informations du client</h3>
      <ul>
        <li><strong>Nom:</strong> ${inquiry.name}</li>
        <li><strong>Email:</strong> ${inquiry.email}</li>
        ${inquiry.phone ? `<li><strong>Téléphone:</strong> ${inquiry.phone}</li>` : ''}
        <li><strong>Localisation:</strong> ${inquiry.location || 'Non spécifiée'}</li>
      </ul>

      <h3>Détails du projet</h3>
      <ul>
        <li><strong>Type de demande:</strong> ${inquiry.projectType}</li>
        <li><strong>Sujet:</strong> ${inquiry.subject}</li>
        <li><strong>Budget:</strong> ${inquiry.budget || 'Non spécifié'}</li>
        <li><strong>Taille:</strong> ${inquiry.size || 'Non spécifiée'}</li>
        <li><strong>Emplacement:</strong> ${inquiry.placement || 'Non spécifié'}</li>
        <li><strong>Styles souhaités:</strong> ${inquiry.tattooStyle?.join(', ') || 'Non spécifiés'}</li>
        <li><strong>Date souhaitée:</strong> ${inquiry.preferredDate || 'Flexible'}</li>
        <li><strong>Tatouages existants:</strong> ${inquiry.hasExistingTattoos ? 'Oui' : 'Non'}</li>
      </ul>

      <h3>Message</h3>
      <p>${inquiry.message.replace(/\n/g, '<br>')}</p>

      ${
        inquiry.referenceImages && inquiry.referenceImages.length > 0
          ? `<p><strong>Images de référence:</strong> ${inquiry.referenceImages.length} fichier(s) joint(s)</p>`
          : ''
      }

      <hr>
      <p><small>Cette demande a été envoyée depuis la plateforme Blottr ${artistName ? `pour l'artiste ${artistName}` : ''}.</small></p>
    `
  }
}

// Export singleton instance
export const formService = FormService.getInstance()

import { ContactInquiry } from '../components/forms'
import { api } from '../lib/api'

export interface FormSubmissionResult {
  success: boolean
  message: string
  inquiryId?: string
}

export class FormService {
  private static instance: FormService
  private baseUrl: string

  private constructor() {
    this.baseUrl = '/api'
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

      // Add basic form fields (map to backend expected names)
      formData.append('fullName', inquiry.name)
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
        // Send each style as separate form field for backend array handling
        inquiry.tattooStyle.forEach((style, index) => {
          formData.append(`tattooStyles[${index}]`, style)
        })
      }

      // Add boolean fields
      formData.append('hasExistingTattoos', inquiry.hasExistingTattoos.toString())

      // Add reference images
      if (inquiry.referenceImages && inquiry.referenceImages.length > 0) {
        inquiry.referenceImages.forEach((file, index) => {
          formData.append('referenceImages', file)
        })
        formData.append('referenceImageCount', inquiry.referenceImages.length.toString())
      }

      // Add CSRF token to FormData for manual fetch
      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      if (csrfToken) {
        formData.append('_token', csrfToken)
      }

      // Make actual API call
      const response = await fetch(`${this.baseUrl}/contact-inquiries`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'X-CSRF-TOKEN': csrfToken || '',
          // Don't set Content-Type - let browser set it with boundary for FormData
        },
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit inquiry')
      }

      return {
        success: data.success,
        message: data.message,
        inquiryId: data.inquiryId,
      }
    } catch (error) {
      console.error('Form submission error:', error)
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer.",
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
      const result = await api.post<{
        success: boolean
        message: string
        inquiryId?: string
      }>('/contact-inquiries/quick', data)

      return {
        success: result.success,
        message: result.message,
        inquiryId: result.inquiryId,
      }
    } catch (error: any) {
      console.error('Quick inquiry submission error:', error)
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Une erreur est survenue lors de l'envoi de votre message.",
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

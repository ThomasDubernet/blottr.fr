import React, { useState } from 'react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export interface ContactInquiry {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  projectType: 'consultation' | 'quote' | 'appointment' | 'question'
  budget?: string
  preferredDate?: string
  location?: string
  tattooStyle?: string[]
  size?: 'small' | 'medium' | 'large' | 'full-sleeve' | 'full-back'
  placement?: string
  hasExistingTattoos: boolean
  referenceImages?: File[]
}

interface ContactInquiryFormProps {
  artistId?: string
  artistName?: string
  onSubmit: (inquiry: ContactInquiry) => Promise<void>
  onCancel?: () => void
  className?: string
  defaultProjectType?: ContactInquiry['projectType']
}

const tattooStyles = [
  'Traditionnel',
  'Réaliste',
  'Japonais',
  'Géométrique',
  'Aquarelle',
  'Blackwork',
  'Neo-traditionnel',
  'Dotwork',
  'Tribal',
  'Biomécanique',
  'Portrait',
  'Lettrage',
  'Minimaliste',
  'Old School',
  'New School',
  'Trash Polka',
]

const budgetRanges = [
  { value: '100-300', label: '100€ - 300€' },
  { value: '300-500', label: '300€ - 500€' },
  { value: '500-1000', label: '500€ - 1000€' },
  { value: '1000-2000', label: '1000€ - 2000€' },
  { value: '2000+', label: '2000€+' },
  { value: 'discuss', label: 'À discuter' },
]

export function ContactInquiryForm({
  artistId,
  artistName,
  onSubmit,
  onCancel,
  className,
  defaultProjectType = 'consultation',
}: ContactInquiryFormProps) {
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    projectType: defaultProjectType,
    budget: '',
    preferredDate: '',
    location: '',
    tattooStyle: [],
    placement: '',
    hasExistingTattoos: false,
    referenceImages: [],
  })

  const [errors, setErrors] = useState<Partial<Record<keyof ContactInquiry, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ContactInquiry, string>> = {}

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
      if (!formData.email.trim()) {
        newErrors.email = "L'email est requis"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Format d'email invalide"
      }
      if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis'
    }

    if (step === 2) {
      if (!formData.message.trim()) newErrors.message = 'Le message est requis'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(currentStep)) return

    // Final validation
    const allStepsValid = validateStep(1) && validateStep(2)
    if (!allStepsValid) {
      setCurrentStep(1)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStyleToggle = (style: string) => {
    setFormData((prev) => ({
      ...prev,
      tattooStyle: prev.tattooStyle?.includes(style)
        ? prev.tattooStyle.filter((s) => s !== style)
        : [...(prev.tattooStyle || []), style],
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({ ...prev, referenceImages: files }))
  }

  const getProjectTypeLabel = (type: ContactInquiry['projectType']) => {
    switch (type) {
      case 'consultation':
        return 'Consultation'
      case 'quote':
        return 'Demande de devis'
      case 'appointment':
        return 'Prise de rendez-vous'
      case 'question':
        return 'Question générale'
    }
  }

  return (
    <div className={cn('max-w-2xl mx-auto bg-white rounded-lg shadow-lg', className)}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Contacter {artistName || "l'artiste"}</h2>
        <p className="text-gray-600 mt-1">
          {getProjectTypeLabel(formData.projectType)} - Étape {currentStep} sur 3
        </p>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informations de contact</h3>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de demande
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['consultation', 'quote', 'appointment', 'question'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, projectType: type }))}
                    className={cn(
                      'p-3 text-sm rounded-lg border-2 transition-colors',
                      formData.projectType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {getProjectTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className={errors.name ? 'border-red-300' : ''}
                placeholder="Votre nom et prénom"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className={errors.email ? 'border-red-300' : ''}
                placeholder="votre@email.com"
              />
              {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone (optionnel)
              </label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                placeholder="06 12 34 56 78"
              />
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Sujet *
              </label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData((prev) => ({ ...prev, subject: e.target.value }))}
                className={errors.subject ? 'border-red-300' : ''}
                placeholder="Brève description de votre demande"
              />
              {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject}</p>}
            </div>
          </div>
        )}

        {/* Step 2: Project Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Détails du projet</h3>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Description détaillée *
              </label>
              <textarea
                id="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                className={cn(
                  'w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                  errors.message ? 'border-red-300' : ''
                )}
                placeholder="Décrivez votre projet de tatouage, vos idées, inspirations..."
              />
              {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message}</p>}
            </div>

            {/* Tattoo Styles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Styles de tatouage souhaités
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {tattooStyles.map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => handleStyleToggle(style)}
                    className={cn(
                      'px-3 py-2 text-xs rounded-full border transition-colors',
                      formData.tattooStyle?.includes(style)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Taille approximative
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {[
                  { value: 'small', label: 'Petit' },
                  { value: 'medium', label: 'Moyen' },
                  { value: 'large', label: 'Grand' },
                  { value: 'full-sleeve', label: 'Manche' },
                  { value: 'full-back', label: 'Dos complet' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, size: value as any }))}
                    className={cn(
                      'px-3 py-2 text-sm rounded-lg border transition-colors',
                      formData.size === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Placement */}
            <div>
              <label htmlFor="placement" className="block text-sm font-medium text-gray-700 mb-1">
                Emplacement sur le corps
              </label>
              <Input
                id="placement"
                type="text"
                value={formData.placement}
                onChange={(e) => setFormData((prev) => ({ ...prev, placement: e.target.value }))}
                placeholder="Ex: bras gauche, dos, cheville..."
              />
            </div>

            {/* Existing Tattoos */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={formData.hasExistingTattoos}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, hasExistingTattoos: e.target.checked }))
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">J'ai déjà des tatouages</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Additional Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Informations complémentaires</h3>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Budget approximatif
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {budgetRanges.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, budget: value }))}
                    className={cn(
                      'p-3 text-sm rounded-lg border transition-colors',
                      formData.budget === value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Date */}
            <div>
              <label
                htmlFor="preferredDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date souhaitée (optionnel)
              </label>
              <Input
                id="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, preferredDate: e.target.value }))
                }
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Votre localisation (optionnel)
              </label>
              <Input
                id="location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                placeholder="Ville, région..."
              />
            </div>

            {/* Reference Images */}
            <div>
              <label
                htmlFor="referenceImages"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Images de référence (optionnel)
              </label>
              <input
                id="referenceImages"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ajoutez des images d'inspiration ou de références (max 5 fichiers)
              </p>
              {formData.referenceImages && formData.referenceImages.length > 0 && (
                <p className="text-sm text-green-600 mt-1">
                  {formData.referenceImages.length} fichier(s) sélectionné(s)
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
          <div>
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={handleBack}>
                Précédent
              </Button>
            )}
          </div>

          <div className="flex space-x-3">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}

            {currentStep < 3 ? (
              <Button type="button" onClick={handleNext}>
                Suivant
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer la demande'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

export type { ContactInquiryFormProps }

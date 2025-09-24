import React, { useState, useCallback } from 'react'
import { router } from '@inertiajs/react'

interface Artist {
  id: string
  firstname: string
  lastname: string
  email?: string
  phone?: string
  is_verified: boolean
  verification_status: 'scraped' | 'contacted' | 'onboarding' | 'verified'
}

interface ContactFormProps {
  artist: Artist
  user?: {
    id: string
    email: string
    phone?: string
  }
  className?: string
  onSubmit?: (data: ContactFormData) => void
  onSuccess?: () => void
  onCancel?: () => void
  isModal?: boolean
}

interface ContactFormData {
  message: string
  preferred_contact_method: 'email' | 'phone'
  availability: string
  budget_min?: number
  budget_max?: number
  urgency: 'asap' | 'this_month' | 'flexible'
  reference_images?: File[]
  project_description: string
  tattoo_placement: string
  tattoo_size: 'small' | 'medium' | 'large' | 'sleeve'
  style_preferences: string[]
  has_tattoos: boolean
  is_first_tattoo: boolean
}

const URGENCY_OPTIONS = [
  { value: 'asap', label: 'As soon as possible', description: 'Within 1-2 weeks' },
  { value: 'this_month', label: 'This month', description: 'Within 4 weeks' },
  { value: 'flexible', label: 'Flexible', description: 'No rush, whenever works' },
]

const SIZE_OPTIONS = [
  { value: 'small', label: 'Small', description: '2-4 inches (coin to palm size)' },
  { value: 'medium', label: 'Medium', description: '4-8 inches (palm to forearm size)' },
  { value: 'large', label: 'Large', description: '8+ inches (forearm to back piece)' },
  { value: 'sleeve', label: 'Sleeve/Large piece', description: 'Full arm, leg, or back piece' },
]

const STYLE_OPTIONS = [
  'Traditional',
  'Neo-Traditional',
  'Realism',
  'Black & Grey',
  'Watercolor',
  'Geometric',
  'Minimalist',
  'Japanese',
  'Tribal',
  'Dotwork',
  'Fine Line',
  'Blackwork',
  'Portrait',
  'Abstract',
  'Biomechanical',
  'New School',
]

export default function ContactForm({
  artist,
  user,
  className = '',
  onSubmit,
  onSuccess,
  onCancel,
  isModal = false,
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    message: '',
    preferred_contact_method: 'email',
    availability: '',
    urgency: 'flexible',
    project_description: '',
    tattoo_placement: '',
    tattoo_size: 'medium',
    style_preferences: [],
    has_tattoos: false,
    is_first_tattoo: false,
  })

  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [referenceImages, setReferenceImages] = useState<File[]>([])

  const handleInputChange = useCallback(
    (field: keyof ContactFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    },
    [errors]
  )

  const handleStyleToggle = useCallback((style: string) => {
    setFormData((prev) => ({
      ...prev,
      style_preferences: prev.style_preferences.includes(style)
        ? prev.style_preferences.filter((s) => s !== style)
        : [...prev.style_preferences, style],
    }))
  }, [])

  const handleImageUpload = useCallback(
    (files: FileList | null) => {
      if (!files) return

      const newImages = Array.from(files).slice(0, 5 - referenceImages.length)
      setReferenceImages((prev) => [...prev, ...newImages])
    },
    [referenceImages.length]
  )

  const removeImage = useCallback((index: number) => {
    setReferenceImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const validateStep = (stepNumber: number) => {
    const newErrors: Record<string, string> = {}

    switch (stepNumber) {
      case 1:
        if (!formData.project_description.trim()) {
          newErrors.project_description = 'Please describe your tattoo idea'
        }
        if (!formData.tattoo_placement.trim()) {
          newErrors.tattoo_placement = 'Please specify where you want the tattoo'
        }
        break
      case 2:
        if (formData.style_preferences.length === 0) {
          newErrors.style_preferences = 'Please select at least one style preference'
        }
        break
      case 3:
        if (!formData.availability.trim()) {
          newErrors.availability = 'Please provide your availability'
        }
        if (!formData.message.trim()) {
          newErrors.message = 'Please add a personal message'
        }
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setStep((prev) => prev - 1)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(step)) return

    setLoading(true)

    try {
      const submitData = {
        ...formData,
        artist_id: artist.id,
        reference_images: referenceImages,
      }

      if (onSubmit) {
        await onSubmit(submitData)
      } else {
        // Default submission via Inertia
        router.post('/contact-requests', submitData, {
          onSuccess: () => {
            if (onSuccess) onSuccess()
          },
        })
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-responsive-lg font-medium text-foreground mb-4">
                Tell us about your tattoo idea
              </h3>
            </div>

            {/* Project Description */}
            <div className="form-item-responsive">
              <label
                htmlFor="project_description"
                className="form-label"
              >
                Describe your tattoo idea *
              </label>
              <textarea
                id="project_description"
                rows={4}
                className={`form-textarea ${
                  errors.project_description ? 'border-destructive' : 'border-input'
                }`}
                placeholder="Describe your tattoo concept, style, colors, size, and any specific details..."
                value={formData.project_description}
                onChange={(e) => handleInputChange('project_description', e.target.value)}
              />
              {errors.project_description && (
                <p className="form-error">{errors.project_description}</p>
              )}
            </div>

            {/* Tattoo Placement */}
            <div className="form-item-responsive">
              <label
                htmlFor="tattoo_placement"
                className="form-label"
              >
                Where do you want the tattoo? *
              </label>
              <input
                type="text"
                id="tattoo_placement"
                className={`form-input ${
                  errors.tattoo_placement ? 'border-destructive' : 'border-input'
                }`}
                placeholder="e.g., Upper arm, forearm, shoulder blade, ankle..."
                value={formData.tattoo_placement}
                onChange={(e) => handleInputChange('tattoo_placement', e.target.value)}
              />
              {errors.tattoo_placement && (
                <p className="form-error">{errors.tattoo_placement}</p>
              )}
            </div>

            {/* Size Selection */}
            <div className="form-item-responsive">
              <label className="form-label">
                Approximate size
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-responsive-sm">
                {SIZE_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`relative flex items-start p-responsive-sm border-2 rounded-lg cursor-pointer hover:bg-accent transition-colors focus-ring ${
                      formData.tattoo_size === option.value
                        ? 'border-primary bg-primary/5'
                        : 'border-input'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tattoo_size"
                      value={option.value}
                      checked={formData.tattoo_size === option.value}
                      onChange={(e) => handleInputChange('tattoo_size', e.target.value)}
                      className="sr-only"
                    />
                    <div>
                      <div className="font-medium text-foreground text-responsive-base">{option.label}</div>
                      <div className="text-responsive-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Reference Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reference images (optional)
              </label>
              <div className="mt-2">
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-primary-400">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="reference-images"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500"
                      >
                        <span>Upload images</span>
                        <input
                          id="reference-images"
                          type="file"
                          className="sr-only"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB (max 5 images)</p>
                  </div>
                </div>

                {/* Image Previews */}
                {referenceImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {referenceImages.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Reference ${index + 1}`}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* First Tattoo */}
            <div>
              <div className="flex items-start">
                <input
                  id="is_first_tattoo"
                  type="checkbox"
                  checked={formData.is_first_tattoo}
                  onChange={(e) => handleInputChange('is_first_tattoo', e.target.checked)}
                  className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="is_first_tattoo" className="ml-2 text-sm text-gray-700">
                  This is my first tattoo
                </label>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Style preferences</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select the tattoo styles you're interested in. This helps the artist understand your
                taste.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select styles that appeal to you *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STYLE_OPTIONS.map((style) => (
                  <label
                    key={style}
                    className={`relative flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.style_preferences.includes(style)
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.style_preferences.includes(style)}
                      onChange={() => handleStyleToggle(style)}
                      className="sr-only"
                    />
                    <div className="text-sm font-medium text-gray-900">{style}</div>
                    {formData.style_preferences.includes(style) && (
                      <svg
                        className="ml-auto h-5 w-5 text-primary-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
              {errors.style_preferences && (
                <p className="mt-2 text-sm text-red-600">{errors.style_preferences}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Do you have other tattoos?
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_tattoos"
                    value="true"
                    checked={formData.has_tattoos}
                    onChange={(e) => handleInputChange('has_tattoos', true)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Yes, I have other tattoos</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="has_tattoos"
                    value="false"
                    checked={!formData.has_tattoos}
                    onChange={(e) => handleInputChange('has_tattoos', false)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    No, this is my first or one of my first
                  </span>
                </label>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact details & timing</h3>
            </div>

            {/* Budget Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Budget range (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="budget_min" className="block text-xs text-gray-500 mb-1">
                    Minimum
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="budget_min"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                      value={formData.budget_min || ''}
                      onChange={(e) =>
                        handleInputChange('budget_min', parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="budget_max" className="block text-xs text-gray-500 mb-1">
                    Maximum
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-500">$</span>
                    <input
                      type="number"
                      id="budget_max"
                      min="0"
                      className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="0"
                      value={formData.budget_max || ''}
                      onChange={(e) =>
                        handleInputChange('budget_max', parseInt(e.target.value) || undefined)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Urgency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                How urgent is this tattoo?
              </label>
              <div className="space-y-3">
                {URGENCY_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className={`flex items-start p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.urgency === option.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.value}
                      checked={formData.urgency === option.value}
                      onChange={(e) => handleInputChange('urgency', e.target.value)}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="availability"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your availability *
              </label>
              <textarea
                id="availability"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.availability ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="When are you generally available? Include preferred days/times, any restrictions..."
                value={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.value)}
              />
              {errors.availability && (
                <p className="mt-1 text-sm text-red-600">{errors.availability}</p>
              )}
            </div>

            {/* Contact Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred contact method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferred_contact_method"
                    value="email"
                    checked={formData.preferred_contact_method === 'email'}
                    onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferred_contact_method"
                    value="phone"
                    checked={formData.preferred_contact_method === 'phone'}
                    onChange={(e) => handleInputChange('preferred_contact_method', e.target.value)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-700">Phone call</span>
                </label>
              </div>
            </div>

            {/* Personal Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Personal message *
              </label>
              <textarea
                id="message"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.message ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder={`Hi ${artist.firstname}, I'm interested in getting a tattoo and would love to work with you...`}
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
              {errors.message && <p className="mt-1 text-sm text-red-600">{errors.message}</p>}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div
      className={`bg-background ${isModal ? '' : 'card-responsive shadow-card border border-border'} ${className}`}
    >
      {/* Header */}
      <div className={`${isModal ? 'p-responsive-lg' : 'p-responsive-lg'} border-b border-border`}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="heading-section text-foreground">
              Contact {artist.firstname} {artist.lastname}
            </h2>
            {!artist.is_verified && (
              <div className="flex items-center mt-2 text-responsive-sm text-warning-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                This artist hasn't claimed their profile yet. We'll help them get set up.
              </div>
            )}
          </div>

          {isModal && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 flex items-center">
          {[1, 2, 3].map((stepNumber) => (
            <React.Fragment key={stepNumber}>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-responsive-sm font-medium ${
                  stepNumber === step
                    ? 'bg-primary text-primary-foreground'
                    : stepNumber < step
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {stepNumber < step ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-4 ${
                    stepNumber < step ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-responsive-lg">
        {renderStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 mt-6 border-t border-border">
          <div>
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="inline-flex items-center btn-responsive text-responsive-sm font-medium text-foreground bg-background border border-border shadow-sm hover:bg-accent focus-ring"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>
            )}
          </div>

          <div className="flex gap-responsive-sm">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center btn-responsive text-responsive-sm font-medium text-foreground bg-background border border-border shadow-sm hover:bg-accent focus-ring"
              >
                Cancel
              </button>
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center btn-responsive text-responsive-sm font-medium text-primary-foreground bg-primary border border-transparent shadow-sm hover:bg-primary/90 focus-ring"
              >
                Next
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center btn-responsive text-responsive-sm font-medium text-primary-foreground bg-primary border border-transparent shadow-sm hover:bg-primary/90 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="loading-spinner -ml-1 mr-3 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Contact Request'
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}

import React, { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { ContactInquiryForm, ContactInquiry, ContactInquiryFormProps } from './contact_inquiry_form'
import { cn } from '../../lib/utils'

interface ContactModalProps extends Omit<ContactInquiryFormProps, 'onCancel'> {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function ContactModal({ isOpen, onClose, title, ...formProps }: ContactModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  // Focus management and accessibility
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      document.body.style.overflow = 'hidden'
      // Focus the close button for screen readers
      setTimeout(() => closeButtonRef.current?.focus(), 100)

      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }

      document.addEventListener('keydown', handleEscape)

      return () => {
        document.body.style.overflow = ''
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleFormSubmit = async (inquiry: ContactInquiry) => {
    try {
      await formProps.onSubmit(inquiry)
      onClose() // Close modal on successful submission
    } catch (error) {
      // Error handling is done by the form component
      throw error
    }
  }

  const modalTitle = title || `Contacter ${formProps.artistName}`

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackgroundClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div
        ref={modalRef}
        className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        role="document"
      >
        {/* Screen reader title */}
        <h1 id="modal-title" className="sr-only">{modalTitle}</h1>
        <div id="modal-description" className="sr-only">
          Formulaire de contact pour prendre rendez-vous avec {formProps.artistName}
        </div>

        {/* Close button */}
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label={`Fermer le formulaire de contact avec ${formProps.artistName}`}
        >
          <svg
            className="w-5 h-5 text-gray-600"
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

        {/* Form */}
        <div className="bg-white rounded-lg shadow-xl">
          <ContactInquiryForm
            {...formProps}
            onSubmit={handleFormSubmit}
            onCancel={onClose}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export type { ContactModalProps }

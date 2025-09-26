import React from 'react'
import { createPortal } from 'react-dom'
import { ContactInquiryForm, ContactInquiry, ContactInquiryFormProps } from './contact_inquiry_form'
import { cn } from '../../lib/utils'

interface ContactModalProps extends Omit<ContactInquiryFormProps, 'onCancel'> {
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function ContactModal({ isOpen, onClose, title, ...formProps }: ContactModalProps) {
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

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Fermer"
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
        <ContactInquiryForm
          {...formProps}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          className="mx-auto"
        />
      </div>
    </div>
  )

  return createPortal(modal, document.body)
}

export type { ContactModalProps }

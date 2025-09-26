import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test } from '@japa/runner'
import ContactModal from '~/components/forms/contact_modal'

test.group('ContactModal Component', () => {
  test('should render modal when isOpen is true', async () => {
    const mockOnClose = jest.fn()

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Check modal is rendered
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Contacter John Doe')).toBeInTheDocument()
    expect(screen.getByText('Informations de contact')).toBeInTheDocument()
  })

  test('should not render modal when isOpen is false', async () => {
    const mockOnClose = jest.fn()

    render(
      <ContactModal
        isOpen={false}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Modal should not be in document
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  test('should close modal when clicking backdrop', async () => {
    const mockOnClose = jest.fn()

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Click on backdrop (modal overlay)
    fireEvent.click(screen.getByRole('dialog').parentElement!)

    expect(mockOnClose).toHaveBeenCalled()
  })

  test('should close modal when pressing escape key', async () => {
    const mockOnClose = jest.fn()

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Press escape key
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape', keyCode: 27 })

    expect(mockOnClose).toHaveBeenCalled()
  })

  test('should not close modal when clicking inside modal content', async () => {
    const mockOnClose = jest.fn()

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Click inside modal content
    fireEvent.click(screen.getByRole('dialog'))

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test('should handle form submission success', async () => {
    const mockOnClose = jest.fn()
    
    // Mock successful form service response
    jest.mock('~/services/form_service', () => ({
      submitContactInquiry: jest.fn().mockResolvedValue({
        success: true,
        inquiryId: 'INQ-12345',
      }),
    }))

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Fill and submit form
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Détails du projet')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Type de tatouage *'), {
      target: { value: 'Nouveau tatouage' },
    })
    fireEvent.change(screen.getByLabelText('Emplacement *'), {
      target: { value: 'Bras' },
    })
    fireEvent.change(screen.getByLabelText('Taille approximative *'), {
      target: { value: 'Moyen (10-20cm)' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Informations complémentaires')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Envoyer la demande'))

    // Wait for success message and auto-close
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled()
    }, { timeout: 5000 })
  })

  test('should handle form submission error', async () => {
    const mockOnClose = jest.fn()
    
    // Mock failed form service response
    jest.mock('~/services/form_service', () => ({
      submitContactInquiry: jest.fn().mockRejectedValue(new Error('Network error')),
    }))

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Fill and submit form (minimal required fields)
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Détails du projet')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Type de tatouage *'), {
      target: { value: 'Nouveau tatouage' },
    })
    fireEvent.change(screen.getByLabelText('Emplacement *'), {
      target: { value: 'Bras' },
    })
    fireEvent.change(screen.getByLabelText('Taille approximative *'), {
      target: { value: 'Moyen (10-20cm)' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Informations complémentaires')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Envoyer la demande'))

    // Error should be shown, modal should stay open
    await waitFor(() => {
      expect(screen.getByText('Erreur lors de l’envoi')).toBeInTheDocument()
    })

    expect(mockOnClose).not.toHaveBeenCalled()
  })

  test('should show loading state during submission', async () => {
    const mockOnClose = jest.fn()
    
    // Mock delayed form service response
    jest.mock('~/services/form_service', () => ({
      submitContactInquiry: jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve({ success: true }), 1000))
      ),
    }))

    render(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Navigate to final step and submit
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Détails du projet')).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText('Type de tatouage *'), {
      target: { value: 'Nouveau tatouage' },
    })
    fireEvent.change(screen.getByLabelText('Emplacement *'), {
      target: { value: 'Bras' },
    })
    fireEvent.change(screen.getByLabelText('Taille approximative *'), {
      target: { value: 'Moyen (10-20cm)' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Informations complémentaires')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Envoyer la demande'))

    // Should show loading state
    await waitFor(() => {
      expect(screen.getByText('Envoi en cours...')).toBeInTheDocument()
    })
  })

  test('should prevent body scroll when modal is open', async () => {
    const mockOnClose = jest.fn()

    const { rerender } = render(
      <ContactModal
        isOpen={false}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Body should not have overflow hidden initially
    expect(document.body.style.overflow).not.toBe('hidden')

    // Open modal
    rerender(
      <ContactModal
        isOpen={true}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Body should have overflow hidden when modal is open
    expect(document.body.style.overflow).toBe('hidden')

    // Close modal
    rerender(
      <ContactModal
        isOpen={false}
        onClose={mockOnClose}
        artistName="John Doe"
      />
    )

    // Body scroll should be restored
    expect(document.body.style.overflow).toBe('')
  })
})

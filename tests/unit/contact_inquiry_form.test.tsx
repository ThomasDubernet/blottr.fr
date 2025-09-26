import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { expect, test } from '@japa/runner'
import ContactInquiryForm from '~/components/forms/contact_inquiry_form'

test.group('ContactInquiryForm Component', () => {
  test('should render initial contact info step', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Check step 1 elements are present
    expect(screen.getByText('Informations de contact')).toBeInTheDocument()
    expect(screen.getByLabelText('Nom complet *')).toBeInTheDocument()
    expect(screen.getByLabelText('Email *')).toBeInTheDocument()
    expect(screen.getByLabelText('Téléphone')).toBeInTheDocument()
    expect(screen.getByText('Suivant')).toBeInTheDocument()
  })

  test('should validate required fields in step 1', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Try to proceed without filling required fields
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Nom requis')).toBeInTheDocument()
      expect(screen.getByText('Email requis')).toBeInTheDocument()
    })

    // Form should not proceed to next step
    expect(screen.getByText('Informations de contact')).toBeInTheDocument()
  })

  test('should validate email format', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Fill form with invalid email
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'invalid-email' },
    })

    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Email invalide')).toBeInTheDocument()
    })
  })

  test('should proceed to step 2 with valid data', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Fill step 1 with valid data
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Téléphone'), {
      target: { value: '+33 6 12 34 56 78' },
    })

    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Détails du projet')).toBeInTheDocument()
      expect(screen.getByLabelText('Type de tatouage *')).toBeInTheDocument()
    })
  })

  test('should navigate back to previous step', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Fill step 1 and proceed
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

    // Go back to step 1
    fireEvent.click(screen.getByText('Précédent'))

    await waitFor(() => {
      expect(screen.getByText('Informations de contact')).toBeInTheDocument()
      expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
      expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument()
    })
  })

  test('should validate project details in step 2', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Navigate to step 2
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

    // Try to proceed without required fields
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('Type de tatouage requis')).toBeInTheDocument()
    })
  })

  test('should complete full form submission flow', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Step 1: Contact Info
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

    // Step 2: Project Details
    fireEvent.change(screen.getByLabelText('Type de tatouage *'), {
      target: { value: 'Nouveau tatouage' },
    })
    fireEvent.change(screen.getByLabelText('Style souhaité'), {
      target: { value: 'Réaliste' },
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

    // Step 3: Additional Info and Submit
    fireEvent.change(screen.getByLabelText('Description détaillée'), {
      target: { value: 'Test tattoo description' },
    })
    fireEvent.click(screen.getByText('Envoyer la demande'))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        contact: {
          fullName: 'Test User',
          email: 'test@example.com',
          phone: '',
        },
        project: {
          type: 'Nouveau tatouage',
          style: 'Réaliste',
          placement: 'Bras',
          size: 'Moyen (10-20cm)',
          isFirstTattoo: false,
          hasTattoos: false,
        },
        additional: {
          description: 'Test tattoo description',
          budget: '',
          timeline: '',
          questions: '',
          referenceImages: [],
        },
      })
    })
  })

  test('should handle cancel action', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    fireEvent.click(screen.getByText('Annuler'))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  test('should show progress indicators', async () => {
    const mockOnSubmit = jest.fn()
    const mockOnCancel = jest.fn()

    render(
      <ContactInquiryForm
        artistName="John Doe"
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    )

    // Check initial progress
    expect(screen.getByText('1 / 3')).toBeInTheDocument()

    // Navigate to step 2
    fireEvent.change(screen.getByLabelText('Nom complet *'), {
      target: { value: 'Test User' },
    })
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.click(screen.getByText('Suivant'))

    await waitFor(() => {
      expect(screen.getByText('2 / 3')).toBeInTheDocument()
    })
  })
})

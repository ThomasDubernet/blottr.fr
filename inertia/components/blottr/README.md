# Blottr Radix UI Components

Advanced, accessible UI components built specifically for the Blottr tattoo platform using Radix UI primitives.

## 🎯 Overview

This collection provides fully accessible, interactive components designed for the tattoo industry, featuring:

- **WCAG 2.1 AA compliance** - Built-in screen reader support and keyboard navigation
- **Complex interactions** - Multi-step forms, image galleries, advanced filtering
- **Tattoo-specific features** - Artist profiles, booking workflows, portfolio management
- **Notification system** - Contextual toasts for platform interactions

## 📦 Components

### Artist Profile Modal

A comprehensive artist profile modal with image gallery, portfolio tabs, and contact integration.

```tsx
import { ArtistProfileModal } from '~/components/blottr'

;<ArtistProfileModal
  artist={artist}
  tattoos={tattoos}
  onContactClick={(artistId) => openContactForm(artistId)}
  onFavoriteClick={(artistId) => toggleFavorite(artistId)}
>
  <ArtistCard artist={artist} />
</ArtistProfileModal>
```

**Features:**

- Full-screen image gallery with keyboard navigation
- Tabbed interface (Portfolio, About, Contact)
- Instagram integration display
- Accessibility-focused design
- Mobile-responsive layout

### Contact Form Wizard

Multi-step contact form for tattoo inquiries with comprehensive validation.

```tsx
import { ContactFormWizard } from '~/components/blottr'

;<ContactFormWizard
  isOpen={isContactFormOpen}
  onOpenChange={setIsContactFormOpen}
  artist={selectedArtist}
  onSubmit={handleContactSubmit}
/>
```

**Steps:**

1. Basic contact information
2. Project details (style, placement, size)
3. Timeline and preferences
4. Medical information and agreements

**Features:**

- Step-by-step validation
- Progress indicator
- Tattoo-specific fields
- Medical considerations
- Terms acceptance

### Advanced Search Filters

Comprehensive filtering system for finding tattoo artists.

```tsx
import { AdvancedSearchFilters, type SearchFilters } from '~/components/blottr'

const [filters, setFilters] = useState<SearchFilters>({
  sortBy: 'relevance',
})

;<AdvancedSearchFilters
  filters={filters}
  onFiltersChange={setFilters}
  cities={availableCities}
  totalResults={searchResults.length}
  isLoading={isSearching}
/>
```

**Filter Categories:**

- Location with radius selection
- Tattoo styles (Traditional, Realism, etc.)
- Body placement options
- Price ranges
- Artist verification status
- Portfolio requirements

### Notification System

Context-based toast notifications with tattoo platform specializations.

```tsx
import { NotificationProvider, useTattooNotifications } from '~/components/blottr'

// Wrap your app
;<NotificationProvider>
  <App />
</NotificationProvider>

// Use in components
const notifications = useTattooNotifications()

// Platform-specific notifications
notifications.notifyContactSent(artistName)
notifications.notifyBookingConfirmed(artistName, appointmentDate)
notifications.notifyPaymentSuccess(amount, artistName)
```

**Notification Types:**

- Contact confirmations
- Booking reminders
- Payment status updates
- Profile verification status
- System messages

## 🎨 Styling

All components use Tailwind CSS with the tattoo platform color scheme:

```css
:root {
  --color-primary: 231 93 93; /* Tattoo red */
  --color-ink: 113 113 122; /* Ink gray */
  --color-flash: 249 115 22; /* Flash orange */
  --color-verified: 16 185 129; /* Verified green */
}
```

## ♿ Accessibility Features

### ARIA Support

- Proper labeling and descriptions
- Role definitions for complex widgets
- Live regions for dynamic content

### Keyboard Navigation

- Tab order optimization
- Escape key handling
- Arrow key navigation in galleries

### Screen Reader Support

- Descriptive alt text for images
- Status announcements
- Content structure markup

### Focus Management

- Visible focus indicators
- Focus trap in modals
- Logical focus flow

## 📱 Responsive Design

All components are mobile-first responsive:

```tsx
// Automatic responsive behavior
<AdvancedSearchFilters
  // Desktop: Sidebar filters
  // Mobile: Modal filters with bottom sheet
/>

<ArtistProfileModal
  // Desktop: Large modal
  // Mobile: Full-screen modal
>
```

## 🚀 Performance

- Lazy loading for image galleries
- Virtualization for large lists
- Optimistic updates for interactions
- Bundle size optimization

## 🔧 Usage Examples

### Complete Artist Search Page

```tsx
import {
  ArtistProfileModal,
  AdvancedSearchFilters,
  NotificationProvider,
  useTattooNotifications,
  type SearchFilters,
} from '~/components/blottr'
import { ArtistCard } from '~/components'

export default function ArtistsPage() {
  const [filters, setFilters] = useState<SearchFilters>({ sortBy: 'relevance' })
  const [selectedArtist, setSelectedArtist] = useState(null)
  const notifications = useTattooNotifications()

  const handleContactArtist = async (artistId: string) => {
    try {
      await submitContactRequest(artistId)
      notifications.notifyContactSent(selectedArtist.firstname)
    } catch (error) {
      notifications.showError('Failed to send message', error.message)
    }
  }

  return (
    <div className="flex">
      {/* Filters Sidebar */}
      <aside className="w-80 p-6">
        <AdvancedSearchFilters
          filters={filters}
          onFiltersChange={setFilters}
          cities={cities}
          totalResults={artists.length}
        />
      </aside>

      {/* Results Grid */}
      <main className="flex-1 p-6">
        <div className="gallery-grid">
          {artists.map((artist) => (
            <ArtistProfileModal
              key={artist.id}
              artist={artist}
              tattoos={artist.tattoos}
              onContactClick={handleContactArtist}
              onFavoriteClick={toggleFavorite}
            >
              <ArtistCard artist={artist} />
            </ArtistProfileModal>
          ))}
        </div>
      </main>
    </div>
  )
}
```

### Booking Flow Integration

```tsx
import { ContactFormWizard, useTattooNotifications } from '~/components/blottr'

export default function BookingPage({ artist }: { artist: Artist }) {
  const [isContactOpen, setIsContactOpen] = useState(false)
  const notifications = useTattooNotifications()

  const handleBookingSubmit = async (formData) => {
    try {
      const booking = await createBooking(formData)
      notifications.notifyBookingConfirmed(
        artist.firstname,
        booking.appointmentDate,
        artist.salon?.name
      )
      router.visit('/dashboard/bookings')
    } catch (error) {
      notifications.showError('Booking failed', error.message)
    }
  }

  return (
    <>
      <Button onClick={() => setIsContactOpen(true)}>Book with {artist.firstname}</Button>

      <ContactFormWizard
        isOpen={isContactOpen}
        onOpenChange={setIsContactOpen}
        artist={artist}
        onSubmit={handleBookingSubmit}
      />
    </>
  )
}
```

## 🧪 Testing

Components include accessibility testing support:

```bash
# Run accessibility tests
npm run test:accessibility

# Performance testing
npm run test:performance

# Full integration tests
npm run test:integration
```

## 📚 API Reference

For detailed component APIs, see the TypeScript definitions in each component file. All components export their prop types and include comprehensive JSDoc comments.

---

Built with ❤️ for the tattoo community using [Radix UI](https://radix-ui.com) and [Tailwind CSS](https://tailwindcss.com).

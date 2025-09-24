// Export all UI components
export { default as ArtistCard } from './ArtistCard'
export { default as TattooGallery } from './TattooGallery'
export { default as StyleTag, StyleTags } from './StyleTag'
export { default as BookingCalendar } from './BookingCalendar'
export { default as ContactForm } from './ContactForm'
export { default as ReviewCard, ReviewList, ReviewSummary } from './ReviewCard'
export { default as PortfolioUploader } from './PortfolioUploader'

// Export component types for external use
export type { Artist, ArtistCardProps } from './ArtistCard'

export type { Tattoo, TattooGalleryProps } from './TattooGallery'

export type { StyleTagProps } from './StyleTag'

export type { TimeSlot, BookingCalendarProps } from './BookingCalendar'

export type { ContactFormProps, ContactFormData } from './ContactForm'

export type { Review, ReviewCardProps } from './ReviewCard'

export type { PortfolioUploaderProps } from './PortfolioUploader'

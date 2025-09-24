// Blottr Platform Specific Components
// Complex UI components built with Radix UI primitives for the tattoo platform

// Layout Components
export { Header } from './layout/header'

// Artist & Profile Components
export { ArtistProfileModal } from './ArtistProfileModal'

// Forms & Wizards
export { ContactFormWizard } from './ContactFormWizard'

// Search & Filtering
export { AdvancedSearchFilters, type SearchFilters } from './AdvancedSearchFilters'

// Notifications & Toast System
export {
  NotificationProvider,
  useNotifications,
  useTattooNotifications,
  type Notification,
  type ArtistNotification,
  type BookingNotification,
  type SystemNotification,
  type NotificationType,
  type NotificationAction,
} from './NotificationSystem'

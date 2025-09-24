import React, { createContext, useContext, useState, useCallback, useRef } from 'react'
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  ArtistNotificationToast,
  BookingReminderToast,
} from '../ui/toast'
import { cn } from '../utils/cn'

// Notification types
export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'default'

export interface NotificationAction {
  label: string
  onClick: () => void
  variant?: 'default' | 'destructive'
}

export interface BaseNotification {
  id: string
  title?: string
  description?: string
  type: NotificationType
  duration?: number // in milliseconds, 0 for persistent
  actions?: NotificationAction[]
  onDismiss?: () => void
}

export interface ArtistNotification extends BaseNotification {
  variant: 'artist'
  artistName: string
  message: string
  action?: 'contact_received' | 'booking_confirmed' | 'profile_updated'
  avatar?: string
}

export interface BookingNotification extends BaseNotification {
  variant: 'booking'
  appointmentDate: string
  artistName: string
  salonName?: string
  canReschedule?: boolean
}

export interface SystemNotification extends BaseNotification {
  variant: 'system'
}

export type Notification = ArtistNotification | BookingNotification | SystemNotification

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearAll: () => void
  // Convenience methods
  showSuccess: (title: string, description?: string, options?: Partial<BaseNotification>) => string
  showError: (title: string, description?: string, options?: Partial<BaseNotification>) => string
  showWarning: (title: string, description?: string, options?: Partial<BaseNotification>) => string
  showInfo: (title: string, description?: string, options?: Partial<BaseNotification>) => string
  showArtistNotification: (params: Omit<ArtistNotification, 'id' | 'variant' | 'type'>) => string
  showBookingReminder: (params: Omit<BookingNotification, 'id' | 'variant' | 'type'>) => string
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: React.ReactNode
  defaultDuration?: number
  maxNotifications?: number
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center'
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  defaultDuration = 5000,
  maxNotifications = 5,
  position = 'top-right',
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const generateId = () => {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))

    // Clear timeout if it exists
    const timeout = timeoutRefs.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
  }, [])

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id'>): string => {
      const id = generateId()
      const duration = notification.duration ?? defaultDuration

      const newNotification: Notification = {
        ...notification,
        id,
      } as Notification

      setNotifications((prev) => {
        // Limit the number of notifications
        const updated = [newNotification, ...prev]
        return updated.slice(0, maxNotifications)
      })

      // Set auto-dismiss timeout
      if (duration > 0) {
        const timeout = setTimeout(() => {
          removeNotification(id)
          notification.onDismiss?.()
        }, duration)
        timeoutRefs.current.set(id, timeout)
      }

      return id
    },
    [defaultDuration, maxNotifications, removeNotification]
  )

  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
    timeoutRefs.current.clear()
    setNotifications([])
  }, [])

  // Convenience methods
  const showSuccess = useCallback(
    (title: string, description?: string, options?: Partial<BaseNotification>) => {
      return addNotification({
        variant: 'system',
        type: 'success',
        title,
        description,
        ...options,
      })
    },
    [addNotification]
  )

  const showError = useCallback(
    (title: string, description?: string, options?: Partial<BaseNotification>) => {
      return addNotification({
        variant: 'system',
        type: 'error',
        title,
        description,
        duration: 0, // Errors persist until manually dismissed
        ...options,
      })
    },
    [addNotification]
  )

  const showWarning = useCallback(
    (title: string, description?: string, options?: Partial<BaseNotification>) => {
      return addNotification({
        variant: 'system',
        type: 'warning',
        title,
        description,
        ...options,
      })
    },
    [addNotification]
  )

  const showInfo = useCallback(
    (title: string, description?: string, options?: Partial<BaseNotification>) => {
      return addNotification({
        variant: 'system',
        type: 'info',
        title,
        description,
        ...options,
      })
    },
    [addNotification]
  )

  const showArtistNotification = useCallback(
    (params: Omit<ArtistNotification, 'id' | 'variant' | 'type'>) => {
      return addNotification({
        variant: 'artist',
        type: 'info',
        ...params,
      })
    },
    [addNotification]
  )

  const showBookingReminder = useCallback(
    (params: Omit<BookingNotification, 'id' | 'variant' | 'type'>) => {
      return addNotification({
        variant: 'booking',
        type: 'info',
        ...params,
      })
    },
    [addNotification]
  )

  const getPositionClass = () => {
    switch (position) {
      case 'top-left':
        return 'top-0 left-0'
      case 'top-center':
        return 'top-0 left-1/2 -translate-x-1/2'
      case 'top-right':
        return 'top-0 right-0'
      case 'bottom-left':
        return 'bottom-0 left-0'
      case 'bottom-center':
        return 'bottom-0 left-1/2 -translate-x-1/2'
      case 'bottom-right':
        return 'bottom-0 right-0'
      default:
        return 'top-0 right-0'
    }
  }

  const contextValue: NotificationContextType = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showArtistNotification,
    showBookingReminder,
  }

  return (
    <NotificationContext.Provider value={contextValue}>
      <ToastProvider swipeDirection="right">
        {children}
        <ToastViewport
          className={cn(
            'fixed z-[100] flex flex-col gap-2 w-full max-w-[420px] p-4',
            getPositionClass()
          )}
        />

        {notifications.map((notification) => {
          if (notification.variant === 'artist') {
            return (
              <ArtistNotificationToast
                key={notification.id}
                artistName={notification.artistName}
                message={notification.message}
                action={notification.action}
                avatar={notification.avatar}
                onOpenChange={(open) => {
                  if (!open) {
                    removeNotification(notification.id)
                  }
                }}
              >
                {notification.actions?.map((action, index) => (
                  <ToastAction key={index} altText={action.label} onClick={action.onClick}>
                    {action.label}
                  </ToastAction>
                ))}
              </ArtistNotificationToast>
            )
          }

          if (notification.variant === 'booking') {
            return (
              <BookingReminderToast
                key={notification.id}
                appointmentDate={notification.appointmentDate}
                artistName={notification.artistName}
                salonName={notification.salonName}
                canReschedule={notification.canReschedule}
                onOpenChange={(open) => {
                  if (!open) {
                    removeNotification(notification.id)
                  }
                }}
              />
            )
          }

          // System notification
          return (
            <Toast
              key={notification.id}
              variant={notification.type === 'error' ? 'destructive' : (notification.type as any)}
              onOpenChange={(open) => {
                if (!open) {
                  removeNotification(notification.id)
                }
              }}
            >
              <div className="grid gap-1">
                {notification.title && <ToastTitle>{notification.title}</ToastTitle>}
                {notification.description && (
                  <ToastDescription>{notification.description}</ToastDescription>
                )}
              </div>

              {notification.actions?.map((action, index) => (
                <ToastAction key={index} altText={action.label} onClick={action.onClick}>
                  {action.label}
                </ToastAction>
              ))}

              <ToastClose />
            </Toast>
          )
        })}
      </ToastProvider>
    </NotificationContext.Provider>
  )
}

// Hook for common notification patterns in tattoo platform
export const useTattooNotifications = () => {
  const notifications = useNotifications()

  const notifyContactSent = useCallback(
    (artistName: string) => {
      return notifications.showSuccess(
        'Message sent successfully',
        `Your message has been sent to ${artistName}. They will respond directly to your email.`
      )
    },
    [notifications]
  )

  const notifyContactReceived = useCallback(
    (artistName: string, avatar?: string) => {
      return notifications.showArtistNotification({
        artistName,
        message: 'You have a new tattoo inquiry',
        action: 'contact_received',
        avatar,
        duration: 0, // Persistent until dismissed
        actions: [
          {
            label: 'View Message',
            onClick: () => {
              // Navigate to messages
              window.location.href = '/dashboard/messages'
            },
          },
        ],
      })
    },
    [notifications]
  )

  const notifyBookingConfirmed = useCallback(
    (artistName: string, appointmentDate: string, salonName?: string) => {
      return notifications.showBookingReminder({
        appointmentDate,
        artistName,
        salonName,
        canReschedule: true,
        duration: 0,
      })
    },
    [notifications]
  )

  const notifyPaymentSuccess = useCallback(
    (amount: number, artistName: string) => {
      return notifications.showSuccess(
        'Payment successful',
        `Your payment of $${amount} to ${artistName} has been processed successfully.`
      )
    },
    [notifications]
  )

  const notifyPaymentFailed = useCallback(
    (error?: string) => {
      return notifications.showError(
        'Payment failed',
        error || 'There was an issue processing your payment. Please try again or contact support.',
        {
          actions: [
            {
              label: 'Retry',
              onClick: () => {
                // Retry payment logic
              },
            },
            {
              label: 'Contact Support',
              onClick: () => {
                window.location.href = '/support'
              },
            },
          ],
        }
      )
    },
    [notifications]
  )

  const notifyProfileUpdated = useCallback(() => {
    return notifications.showSuccess(
      'Profile updated',
      'Your changes have been saved successfully.'
    )
  }, [notifications])

  const notifyImageUploadSuccess = useCallback(
    (count: number) => {
      return notifications.showSuccess(
        `${count} image${count !== 1 ? 's' : ''} uploaded`,
        `Successfully added ${count} new image${count !== 1 ? 's' : ''} to your portfolio.`
      )
    },
    [notifications]
  )

  const notifyImageUploadFailed = useCallback(
    (error?: string) => {
      return notifications.showError(
        'Upload failed',
        error || 'There was an issue uploading your images. Please try again.'
      )
    },
    [notifications]
  )

  const notifyVerificationStatus = useCallback(
    (status: 'approved' | 'rejected', reason?: string) => {
      if (status === 'approved') {
        return notifications.showSuccess(
          'Verification approved',
          'Congratulations! Your artist profile has been verified.'
        )
      } else {
        return notifications.showWarning(
          'Verification needs attention',
          reason || 'Your profile verification requires additional information.'
        )
      }
    },
    [notifications]
  )

  return {
    ...notifications,
    // Specialized methods for tattoo platform
    notifyContactSent,
    notifyContactReceived,
    notifyBookingConfirmed,
    notifyPaymentSuccess,
    notifyPaymentFailed,
    notifyProfileUpdated,
    notifyImageUploadSuccess,
    notifyImageUploadFailed,
    notifyVerificationStatus,
  }
}

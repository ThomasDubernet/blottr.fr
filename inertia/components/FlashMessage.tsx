import { usePage } from '@inertiajs/react'
import { useEffect, useState } from 'react'

interface FlashMessages {
  success?: string
  error?: string
  warning?: string
  info?: string
}

export function FlashMessage() {
  const { flash } = usePage<{ flash?: FlashMessages }>().props
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState<{ type: keyof FlashMessages; text: string } | null>(null)

  useEffect(() => {
    // Guard clause: check if flash exists
    if (!flash) return

    // Check which flash message is present
    if (flash.success) {
      setMessage({ type: 'success', text: flash.success })
      setVisible(true)
    } else if (flash.error) {
      setMessage({ type: 'error', text: flash.error })
      setVisible(true)
    } else if (flash.warning) {
      setMessage({ type: 'warning', text: flash.warning })
      setVisible(true)
    } else if (flash.info) {
      setMessage({ type: 'info', text: flash.info })
      setVisible(true)
    }

    // Auto-hide after 5 seconds
    if (flash.success || flash.error || flash.warning || flash.info) {
      const timer = setTimeout(() => {
        setVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [flash])

  if (!visible || !message) return null

  const styles = {
    success: {
      container: 'bg-green-50 border-green-500 text-green-800',
      icon: (
        <svg
          className="w-5 h-5 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    error: {
      container: 'bg-red-50 border-red-500 text-red-800',
      icon: (
        <svg
          className="w-5 h-5 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-500 text-yellow-800',
      icon: (
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      container: 'bg-blue-50 border-blue-500 text-blue-800',
      icon: (
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  }

  const currentStyle = styles[message.type]

  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md w-full shadow-lg rounded-lg border-l-4 p-4 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      } ${currentStyle.container}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">{currentStyle.icon}</div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message.text}</p>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="ml-4 flex-shrink-0 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

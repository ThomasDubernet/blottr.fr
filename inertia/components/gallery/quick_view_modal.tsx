import React, { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Tattoo } from '../discovery/tattoo_card'
import { cn } from '../../lib/utils'
import { useFavorites } from '../../hooks'
import { ShareModal } from '../ui/share_modal'

interface QuickViewModalProps {
  isOpen: boolean
  onClose: () => void
  tattoo: Tattoo | null
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  onLikeToggle?: (tattooId: string) => void
  onArtistClick?: (artistId: string) => void
}

export function QuickViewModal({
  isOpen,
  onClose,
  tattoo,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
  onLikeToggle,
  onArtistClick,
}: QuickViewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const { isFavorite, toggleFavorite } = useFavorites()

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          onClose()
          break
        case 'ArrowLeft':
          if (hasPrevious && onPrevious) {
            event.preventDefault()
            onPrevious()
          }
          break
        case 'ArrowRight':
          if (hasNext && onNext) {
            event.preventDefault()
            onNext()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, hasNext, hasPrevious, onNext, onPrevious, onClose])

  // Touch gestures for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0) // Reset touchEnd
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && hasNext && onNext) {
      onNext()
    }
    if (isRightSwipe && hasPrevious && onPrevious) {
      onPrevious()
    }
  }

  // Background click to close
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose()
    }
  }

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Reset image loaded state when tattoo changes
  useEffect(() => {
    setImageLoaded(false)
  }, [tattoo?.id])

  if (!isOpen || !tattoo) return null

  const handleLike = () => {
    if (onLikeToggle) {
      onLikeToggle(tattoo.id)
    }
  }

  const handleFavoriteToggle = () => {
    toggleFavorite({
      id: tattoo.id,
      type: 'tattoo',
      title: tattoo.title || 'Tatouage',
      imageUrl: tattoo.imageUrl,
      artistName: tattoo.artist.name,
      location: tattoo.artist.location,
    })
  }

  const isTattooFavorited = isFavorite(tattoo.id, 'tattoo')

  const handleShareClick = () => {
    setShareModalOpen(true)
  }

  const shareableItem = tattoo
    ? {
        id: tattoo.id,
        type: 'tattoo' as const,
        title: tattoo.title || 'Tatouage',
        description: tattoo.description,
        imageUrl: tattoo.imageUrl,
      }
    : null

  const handleArtist = () => {
    if (onArtistClick) {
      onArtistClick(tattoo.artist.id)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const modal = (
    <div
      ref={modalRef}
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4',
        'animate-in fade-in-0 duration-200'
      )}
      onClick={handleBackgroundClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white hover:text-gray-300 transition-colors"
        aria-label="Fermer"
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

      {/* Previous button */}
      {hasPrevious && onPrevious && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Image précédente"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:text-gray-300 transition-colors"
          aria-label="Image suivante"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Modal content */}
      <div className="flex flex-col lg:flex-row max-w-7xl w-full h-full lg:h-auto max-h-full">
        {/* Image container */}
        <div className="flex-1 flex items-center justify-center relative min-h-0">
          <div className="relative max-w-full max-h-full">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
            <img
              ref={imageRef}
              src={tattoo.imageUrl}
              alt={tattoo.title || 'Tatouage'}
              className={cn(
                'max-w-full max-h-full object-contain rounded-lg transition-opacity duration-300',
                imageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          </div>
        </div>

        {/* Details panel */}
        <div className="lg:w-80 xl:w-96 bg-white rounded-lg lg:ml-6 mt-4 lg:mt-0 flex flex-col max-h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {tattoo.title || 'Tatouage'}
                </h2>
                <button
                  onClick={handleArtist}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span className="font-medium">{tattoo.artist.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <p className="text-sm text-gray-500">{tattoo.artist.location}</p>
              </div>

              <div className="flex space-x-2">
                {/* Like button */}
                <button
                  onClick={handleLike}
                  className={cn(
                    'p-2 rounded-full transition-all duration-200',
                    tattoo.isLiked
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-red-500'
                  )}
                  aria-label={tattoo.isLiked ? "Je n'aime plus" : "J'aime"}
                >
                  <svg
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      tattoo.isLiked ? 'scale-110' : 'scale-100'
                    )}
                    fill={tattoo.isLiked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>

                {/* Favorite button */}
                <button
                  onClick={handleFavoriteToggle}
                  className={cn(
                    'p-2 rounded-full transition-all duration-200',
                    isTattooFavorited
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-yellow-500'
                  )}
                  aria-label={isTattooFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  <svg
                    className={cn(
                      'w-5 h-5 transition-transform duration-200',
                      isTattooFavorited ? 'scale-110' : 'scale-100'
                    )}
                    fill={isTattooFavorited ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Styles */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Styles</h3>
              <div className="flex flex-wrap gap-2">
                {tattoo.styles.map((style) => (
                  <span
                    key={style}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full"
                  >
                    {style}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            {tattoo.description && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{tattoo.description}</p>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">{tattoo.likes || 0}</div>
                <div className="text-xs text-gray-500">J'aime</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-900">
                  {formatDate(tattoo.createdAt)}
                </div>
                <div className="text-xs text-gray-500">Créé le</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Demander un devis
              </button>
              <button
                onClick={handleShareClick}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Partager
              </button>
            </div>
          </div>

          {/* Navigation hints for mobile */}
          <div className="lg:hidden p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Swipez à gauche ou droite pour naviguer • Appuyez à l'extérieur pour fermer
            </p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        item={shareableItem}
      />
    </div>
  )

  return createPortal(modal, document.body)
}

export type { QuickViewModalProps }

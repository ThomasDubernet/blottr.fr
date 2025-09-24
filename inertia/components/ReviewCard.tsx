import React from 'react'
import { Link } from '@inertiajs/react'
import { format, formatDistanceToNow } from 'date-fns'

interface Review {
  id: string
  rating: number
  comment: string
  is_verified: boolean
  created_at: string
  client?: {
    id: string
    name?: string
    avatar?: string
    initials?: string
  }
  artist?: {
    id: string
    firstname: string
    lastname: string
    slug?: string
  }
  appointment?: {
    id: string
    service_type?: string
    completed_at?: string
  }
  tattoo?: {
    id: string
    photo?: string
    alt_text?: string
  }
  helpful_count?: number
  response?: {
    id: string
    message: string
    created_at: string
  }
}

interface ReviewCardProps {
  review: Review
  variant?: 'default' | 'compact' | 'detailed' | 'testimonial'
  showArtist?: boolean
  showClient?: boolean
  showTattoo?: boolean
  showResponse?: boolean
  showActions?: boolean
  className?: string
  onHelpfulClick?: (reviewId: string) => void
  onReportClick?: (reviewId: string) => void
}

// Star rating component
function StarRating({
  rating,
  size = 'sm',
  showNumber = true,
}: {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  showNumber?: boolean
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className="flex items-center">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'text-yellow-400' : 'text-gray-200'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      {showNumber && <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>}
    </div>
  )
}

// Client avatar component
function ClientAvatar({
  client,
  size = 'sm',
}: {
  client?: Review['client']
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  }

  if (!client) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gray-200 flex items-center justify-center`}
      >
        <span className="text-gray-400">?</span>
      </div>
    )
  }

  if (client.avatar) {
    return (
      <img
        src={client.avatar}
        alt={client.name || 'Client'}
        className={`${sizeClasses[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center`}
    >
      <span className="font-medium text-primary-700">
        {client.initials || client.name?.charAt(0) || '?'}
      </span>
    </div>
  )
}

export default function ReviewCard({
  review,
  variant = 'default',
  showArtist = false,
  showClient = true,
  showTattoo = false,
  showResponse = true,
  showActions = true,
  className = '',
  onHelpfulClick,
  onReportClick,
}: ReviewCardProps) {
  const isCompact = variant === 'compact'
  const isDetailed = variant === 'detailed'
  const isTestimonial = variant === 'testimonial'

  const handleHelpfulClick = () => {
    if (onHelpfulClick) {
      onHelpfulClick(review.id)
    }
  }

  const handleReportClick = () => {
    if (onReportClick) {
      onReportClick(review.id)
    }
  }

  return (
    <div
      className={`
        bg-background card-responsive border border-border transition-all duration-200
        ${isTestimonial ? 'shadow-gallery hover:shadow-gallery-hover' : 'shadow-card hover:shadow-card-hover'}
        ${className}
      `}
    >
      {/* Header */}
      <div className={`${isCompact ? 'p-responsive-md' : 'p-responsive-lg'}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-responsive-sm">
            {/* Client Avatar */}
            {showClient && <ClientAvatar client={review.client} size={isCompact ? 'sm' : 'md'} />}

            <div className="min-w-0 flex-1">
              {/* Client Info */}
              {showClient && (
                <div className="flex items-center gap-responsive-xs mb-1">
                  <h4
                    className={`font-medium text-foreground ${isCompact ? 'text-responsive-sm' : 'text-responsive-base'}`}
                  >
                    {review.client?.name || 'Anonymous'}
                  </h4>

                  {review.is_verified && (
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="ml-1 badge-verified text-responsive-xs">Verified</span>
                    </div>
                  )}
                </div>
              )}

              {/* Artist Info */}
              {showArtist && review.artist && (
                <div className="mb-2">
                  <Link
                    href={`/artists/${review.artist.slug || review.artist.id}`}
                    className="text-responsive-sm text-primary hover:text-primary/80 font-medium artist-name"
                  >
                    {review.artist.firstname} {review.artist.lastname}
                  </Link>
                </div>
              )}

              {/* Rating and Date */}
              <div className="flex items-center gap-responsive-sm">
                <StarRating
                  rating={review.rating}
                  size={isCompact ? 'sm' : 'md'}
                  showNumber={false}
                />

                <span className="text-responsive-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                </span>

                {review.appointment?.service_type && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-responsive-sm text-muted-foreground">
                      {review.appointment.service_type}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Actions Dropdown */}
          {showActions && (
            <div className="relative">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                aria-label="Review options"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Review Content */}
        <div className="space-responsive-md">
          {/* Comment */}
          <div>
            <p
              className={`text-foreground leading-relaxed ${
                isCompact
                  ? 'text-responsive-sm line-clamp-3'
                  : isDetailed
                    ? 'text-responsive-base'
                    : 'text-responsive-sm'
              }`}
            >
              {review.comment}
            </p>
          </div>

          {/* Tattoo Image */}
          {showTattoo && review.tattoo?.photo && !isCompact && (
            <div className="mt-4">
              <img
                src={review.tattoo.photo}
                alt={review.tattoo.alt_text || 'Tattoo'}
                className="rounded-md max-w-xs max-h-48 object-cover"
              />
            </div>
          )}

          {/* Artist Response */}
          {showResponse && review.response && !isCompact && (
            <div className="mt-4 pl-4 border-l-3 border-primary-200 bg-primary-50 rounded-r-md p-3">
              <div className="flex items-start space-x-2">
                <div className="flex-shrink-0">
                  <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <span className="text-sm font-medium text-primary-900">Artist Response</span>
                    <span className="ml-2 text-xs text-primary-600">
                      {formatDistanceToNow(new Date(review.response.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-primary-800">{review.response.message}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      {showActions && !isCompact && (
        <div className="p-responsive-lg bg-accent/30 border-t border-border rounded-b-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-responsive-lg">
              {/* Helpful Button */}
              <button
                type="button"
                onClick={handleHelpfulClick}
                className="flex items-center text-responsive-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
                Helpful
                {review.helpful_count && review.helpful_count > 0 && (
                  <span className="ml-1">({review.helpful_count})</span>
                )}
              </button>

              {/* Share Button */}
              <button
                type="button"
                className="flex items-center text-responsive-sm text-muted-foreground hover:text-primary transition-colors duration-200 focus-ring"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
                Share
              </button>
            </div>

            {/* Report Button */}
            <button
              type="button"
              onClick={handleReportClick}
              className="text-responsive-sm text-muted-foreground hover:text-foreground transition-colors duration-200 focus-ring"
            >
              Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Utility component for displaying multiple reviews
interface ReviewListProps {
  reviews: Review[]
  variant?: ReviewCardProps['variant']
  showArtist?: boolean
  showClient?: boolean
  showTattoo?: boolean
  showResponse?: boolean
  showActions?: boolean
  className?: string
  emptyMessage?: string
  onHelpfulClick?: (reviewId: string) => void
  onReportClick?: (reviewId: string) => void
}

export function ReviewList({
  reviews,
  variant = 'default',
  showArtist = false,
  showClient = true,
  showTattoo = false,
  showResponse = true,
  showActions = true,
  className = '',
  emptyMessage = 'No reviews yet',
  onHelpfulClick,
  onReportClick,
}: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {reviews.map((review) => (
        <ReviewCard
          key={review.id}
          review={review}
          variant={variant}
          showArtist={showArtist}
          showClient={showClient}
          showTattoo={showTattoo}
          showResponse={showResponse}
          showActions={showActions}
          onHelpfulClick={onHelpfulClick}
          onReportClick={onReportClick}
        />
      ))}
    </div>
  )
}

// Summary component for review statistics
interface ReviewSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: Record<number, number> // rating -> count
  className?: string
}

export function ReviewSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
  className = '',
}: ReviewSummaryProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution))

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-soft p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-2">
          <span className="text-3xl font-bold text-gray-900 mr-2">{averageRating.toFixed(1)}</span>
          <div>
            <StarRating rating={averageRating} size="lg" showNumber={false} />
            <p className="text-sm text-gray-600 mt-1">
              Based on {totalReviews.toLocaleString()} {totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0
          const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0

          return (
            <div key={rating} className="flex items-center text-sm">
              <span className="w-8 text-gray-600">{rating}</span>
              <svg className="w-4 h-4 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-1 mx-2">
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
              <span className="w-8 text-right text-gray-600">{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

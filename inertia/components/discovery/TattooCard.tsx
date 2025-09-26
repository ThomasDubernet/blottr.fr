import React, { useState } from 'react'
import { Link } from '@inertiajs/react'
import { cn } from '../../lib/utils'

interface Tattoo {
  id: string
  title?: string
  imageUrl: string
  artist: {
    id: string
    name: string
    location: string
  }
  styles: string[]
  likes?: number
  isLiked?: boolean
  description?: string
  createdAt: string
}

interface TattooCardProps {
  tattoo: Tattoo
  className?: string
  onImageClick?: (tattoo: Tattoo) => void
  onArtistClick?: (artistId: string) => void
  onLikeToggle?: (tattooId: string) => void
}

export const TattooCard: React.FC<TattooCardProps> = ({
  tattoo,
  className,
  onImageClick,
  onArtistClick,
  onLikeToggle,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleImageClick = () => {
    onImageClick?.(tattoo)
  }

  const handleArtistClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onArtistClick?.(tattoo.artist.id)
  }

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onLikeToggle?.(tattoo.id)
  }

  return (
    <div
      className={cn(
        'group cursor-pointer bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden',
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" onClick={handleImageClick}>
        {!imageLoaded && !imageError && (
          <div className="aspect-[3/4] bg-gray-200 animate-pulse flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {imageError && (
          <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p className="text-xs">Image unavailable</p>
            </div>
          </div>
        )}

        <img
          src={tattoo.imageUrl}
          alt={tattoo.title || `Tattoo by ${tattoo.artist.name}`}
          className={cn(
            'w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          loading="lazy"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-300" />

        {/* Quick actions overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleLikeClick}
            className={cn(
              'p-2 rounded-full backdrop-blur-sm transition-all duration-200',
              tattoo.isLiked
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-white/80 text-gray-700 hover:bg-white'
            )}
          >
            <svg
              className="w-4 h-4"
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
        </div>

        {/* Expand icon */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-1.5 bg-white/80 backdrop-blur-sm rounded-full">
            <svg
              className="w-3 h-3 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Artist Info */}
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={handleArtistClick}
            className="flex items-center space-x-2 hover:text-blue-600 transition-colors text-left"
          >
            <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600">
                {tattoo.artist.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{tattoo.artist.name}</p>
              <p className="text-xs text-gray-500">{tattoo.artist.location}</p>
            </div>
          </button>

          {/* Like count */}
          {tattoo.likes !== undefined && (
            <div className="flex items-center space-x-1 text-gray-500">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="text-xs">{tattoo.likes}</span>
            </div>
          )}
        </div>

        {/* Title */}
        {tattoo.title && (
          <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-1">{tattoo.title}</h3>
        )}

        {/* Description */}
        {tattoo.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">{tattoo.description}</p>
        )}

        {/* Style Tags */}
        <div className="flex flex-wrap gap-1">
          {tattoo.styles.slice(0, 2).map((style) => (
            <span key={style} className="px-1.5 py-0.5 bg-gray-100 text-xs rounded text-gray-700">
              {style}
            </span>
          ))}
          {tattoo.styles.length > 2 && (
            <span className="px-1.5 py-0.5 bg-gray-100 text-xs rounded text-gray-500">
              +{tattoo.styles.length - 2}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export type { Tattoo, TattooCardProps }

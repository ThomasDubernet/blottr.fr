import React from 'react'
import { Link } from '@inertiajs/react'
import { Card, CardContent, CardHeader } from '../ui/Card'
import { cn } from '../../lib/utils'
import { useFavorites } from '../../hooks'

interface Artist {
  id: string
  name: string
  location: string
  bio?: string
  styles: string[]
  portfolioPreview?: string[]
  rating?: number
  reviewCount?: number
  verified?: boolean
}

interface ArtistCardProps {
  artist: Artist
  className?: string
  onClick?: () => void
  showFavoriteButton?: boolean
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  className,
  onClick,
  showFavoriteButton = true,
}) => {
  const { isFavorite, toggleFavorite } = useFavorites()

  const handleClick = () => {
    onClick?.()
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite({
      id: artist.id,
      type: 'artist',
      title: artist.name,
      imageUrl: artist.portfolioPreview?.[0],
      location: artist.location,
    })
  }

  const isArtistFavorited = isFavorite(artist.id, 'artist')

  return (
    <Card
      className={cn(
        'overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group',
        className
      )}
      onClick={handleClick}
    >
      {/* Portfolio Preview */}
      <div className="relative aspect-square bg-gray-200">
        {artist.portfolioPreview && artist.portfolioPreview.length > 0 ? (
          <div className="grid grid-cols-2 gap-1 h-full p-2">
            {artist.portfolioPreview.slice(0, 4).map((image, index) => (
              <div
                key={index}
                className="bg-gray-300 rounded-sm overflow-hidden"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                {!image && (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    Portfolio
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}

        {/* Verified Badge */}
        {artist.verified && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>

      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {artist.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {artist.name}
              </h3>
              <p className="text-sm text-gray-500">{artist.location}</p>
            </div>
          </div>

          {/* Favorite Button */}
          {showFavoriteButton && (
            <button
              className={cn(
                'transition-colors p-1 rounded-full',
                isArtistFavorited
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-gray-400 hover:text-yellow-500'
              )}
              onClick={handleFavoriteClick}
              title={isArtistFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <svg
                className="w-5 h-5"
                fill={isArtistFavorited ? 'currentColor' : 'none'}
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
          )}
        </div>

        {/* Rating */}
        {artist.rating && (
          <div className="flex items-center space-x-1 mt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={cn(
                    'w-4 h-4',
                    star <= Math.floor(artist.rating!) ? 'text-yellow-400' : 'text-gray-300'
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {artist.rating} ({artist.reviewCount})
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Bio Preview */}
        {artist.bio && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{artist.bio}</p>}

        {/* Style Tags */}
        <div className="flex flex-wrap gap-1">
          {artist.styles.slice(0, 3).map((style) => (
            <span
              key={style}
              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {style}
            </span>
          ))}
          {artist.styles.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-500">
              +{artist.styles.length - 3}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export type { Artist, ArtistCardProps }

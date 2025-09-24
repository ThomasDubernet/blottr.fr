import React, { useState } from 'react'
import { Card, CardContent } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Heart, Eye, Instagram, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Tattoo {
  id: string
  photo: string
  alt_text?: string
  description?: string
  is_flash?: boolean
  price?: number
  instagram_post_url?: string
  view_count: number
  like_count: number
  tags?: Array<{
    name: string
    category: string
  }>
  artist: {
    firstname: string
    lastname: string
    instagram_handle?: string
  }
}

interface TattooGalleryProps {
  tattoos: Tattoo[]
  layout?: 'grid' | 'masonry' | 'carousel'
  columns?: 2 | 3 | 4
  showArtistInfo?: boolean
  showStats?: boolean
  onTattooLike?: (tattooId: string) => void
  onTattooView?: (tattooId: string) => void
  className?: string
}

export const TattooGallery: React.FC<TattooGalleryProps> = ({
  tattoos,
  layout = 'grid',
  columns = 3,
  showArtistInfo = true,
  showStats = true,
  onTattooLike,
  onTattooView,
  className,
}) => {
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleTattooClick = (tattoo: Tattoo, index: number) => {
    setSelectedTattoo(tattoo)
    setCurrentIndex(index)
    onTattooView?.(tattoo.id)
  }

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % tattoos.length
    setCurrentIndex(nextIndex)
    setSelectedTattoo(tattoos[nextIndex])
  }

  const handlePrevious = () => {
    const prevIndex = currentIndex === 0 ? tattoos.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setSelectedTattoo(tattoos[prevIndex])
  }

  const TattooCard: React.FC<{ tattoo: Tattoo; index: number; aspectRatio?: string }> = ({
    tattoo,
    index,
    aspectRatio = 'aspect-square',
  }) => (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative">
        <div className={cn('overflow-hidden bg-gray-100', aspectRatio)}>
          <img
            src={tattoo.photo}
            alt={
              tattoo.alt_text || `Tattoo by ${tattoo.artist.firstname} ${tattoo.artist.lastname}`
            }
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onClick={() => handleTattooClick(tattoo, index)}
          />
        </div>

        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onTattooLike?.(tattoo.id)
              }}
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <Heart className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleTattooClick(tattoo, index)}
              className="bg-white/90 hover:bg-white text-gray-900"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {tattoo.instagram_post_url && (
              <Button
                variant="secondary"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(tattoo.instagram_post_url, '_blank')
                }}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Flash badge */}
        {tattoo.is_flash && (
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-yellow-400 text-yellow-900 border-yellow-500">
              Flash {tattoo.price && `€${tattoo.price}`}
            </Badge>
          </div>
        )}

        {/* Stats overlay */}
        {showStats && (
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <div className="flex items-center bg-black/70 rounded-full px-2 py-1 text-xs text-white">
              <Eye className="h-3 w-3 mr-1" />
              {tattoo.view_count}
            </div>
            <div className="flex items-center bg-black/70 rounded-full px-2 py-1 text-xs text-white">
              <Heart className="h-3 w-3 mr-1" />
              {tattoo.like_count}
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <CardContent className="p-3">
        {showArtistInfo && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-900">
                {tattoo.artist.firstname} {tattoo.artist.lastname}
              </span>
              {tattoo.artist.instagram_handle && (
                <span className="text-xs text-gray-500">@{tattoo.artist.instagram_handle}</span>
              )}
            </div>
          </div>
        )}

        {tattoo.tags && tattoo.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {tattoo.tags.slice(0, 2).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag.name}
              </Badge>
            ))}
            {tattoo.tags.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{tattoo.tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {tattoo.description && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">{tattoo.description}</p>
        )}
      </CardContent>
    </Card>
  )

  const renderGrid = () => (
    <div
      className={cn(
        'grid gap-4',
        {
          'grid-cols-2': columns === 2,
          'grid-cols-3': columns === 3,
          'grid-cols-4': columns === 4,
        },
        'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
        className
      )}
    >
      {tattoos.map((tattoo, index) => (
        <TattooCard key={tattoo.id} tattoo={tattoo} index={index} />
      ))}
    </div>
  )

  const renderMasonry = () => (
    <div className={cn('columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4', className)}>
      {tattoos.map((tattoo, index) => (
        <div key={tattoo.id} className="break-inside-avoid mb-4">
          <TattooCard tattoo={tattoo} index={index} aspectRatio="aspect-auto" />
        </div>
      ))}
    </div>
  )

  const renderCarousel = () => (
    <div className={cn('flex space-x-4 overflow-x-auto pb-4', className)}>
      {tattoos.map((tattoo, index) => (
        <div key={tattoo.id} className="flex-none w-64">
          <TattooCard tattoo={tattoo} index={index} />
        </div>
      ))}
    </div>
  )

  const renderGallery = () => {
    switch (layout) {
      case 'masonry':
        return renderMasonry()
      case 'carousel':
        return renderCarousel()
      default:
        return renderGrid()
    }
  }

  return (
    <>
      {renderGallery()}

      {/* Full-screen modal */}
      <Dialog open={!!selectedTattoo} onOpenChange={(open) => !open && setSelectedTattoo(null)}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          {selectedTattoo && (
            <div className="flex h-full">
              {/* Image section */}
              <div className="flex-1 relative bg-black flex items-center justify-center">
                <img
                  src={selectedTattoo.photo}
                  alt={selectedTattoo.alt_text || `Tattoo by ${selectedTattoo.artist.firstname}`}
                  className="max-w-full max-h-full object-contain"
                />

                {/* Navigation arrows */}
                {tattoos.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={handlePrevious}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                      onClick={handleNext}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Info sidebar */}
              <div className="w-80 bg-white p-6 overflow-y-auto">
                <div className="space-y-4">
                  {/* Artist info */}
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedTattoo.artist.firstname} {selectedTattoo.artist.lastname}
                    </h3>
                    {selectedTattoo.artist.instagram_handle && (
                      <p className="text-sm text-gray-600">
                        @{selectedTattoo.artist.instagram_handle}
                      </p>
                    )}
                  </div>

                  {/* Flash info */}
                  {selectedTattoo.is_flash && (
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Flash Tattoo {selectedTattoo.price && `- €${selectedTattoo.price}`}
                    </Badge>
                  )}

                  {/* Description */}
                  {selectedTattoo.description && (
                    <div>
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-sm text-gray-600">{selectedTattoo.description}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedTattoo.tags && selectedTattoo.tags.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedTattoo.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center space-x-4 pt-4 border-t">
                    <div className="flex items-center text-sm text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {selectedTattoo.view_count} views
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Heart className="h-4 w-4 mr-1" />
                      {selectedTattoo.like_count} likes
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t">
                    <Button className="w-full" onClick={() => onTattooLike?.(selectedTattoo.id)}>
                      <Heart className="h-4 w-4 mr-2" />
                      Like Tattoo
                    </Button>
                    {selectedTattoo.instagram_post_url && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.open(selectedTattoo.instagram_post_url, '_blank')}
                      >
                        <Instagram className="h-4 w-4 mr-2" />
                        View on Instagram
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default TattooGallery

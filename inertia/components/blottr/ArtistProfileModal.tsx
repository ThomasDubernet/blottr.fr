import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Separator } from '../ui/separator'
import { cn } from '../utils/cn'

// Types for artist data
interface Artist {
  id: string
  firstname: string
  lastname: string
  slug: string
  bio?: string
  avatar?: string
  instagram_handle?: string
  instagram_url?: string
  instagram_followers?: number
  city?: {
    id: string
    name: string
    slug: string
  }
  salon?: {
    id: string
    name: string
    slug: string
  }
  is_verified: boolean
  is_guest: boolean
  editor_pick: boolean
  view_count: number
  favorite_count: number
  gpt_styles?: string[]
}

interface Tattoo {
  id: string
  photo: string
  alt_text?: string
  description?: string
  is_flash: boolean
  price?: number
  tags: Array<{
    id: string
    name: string
    category: string
  }>
  created_at: string
}

interface ArtistProfileModalProps {
  artist: Artist
  tattoos: Tattoo[]
  children: React.ReactNode
  onContactClick?: (artistId: string) => void
  onFavoriteClick?: (artistId: string) => void
  isBookmarkOpen?: boolean
}

export const ArtistProfileModal: React.FC<ArtistProfileModalProps> = ({
  artist,
  tattoos,
  children,
  onContactClick,
  onFavoriteClick,
  isBookmarkOpen = false,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false)

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
    setIsImageGalleryOpen(true)
  }

  const nextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((selectedImageIndex + 1) % tattoos.length)
    }
  }

  const prevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? tattoos.length - 1 : selectedImageIndex - 1)
    }
  }

  const formatFollowers = (count?: number) => {
    if (!count) return ''
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  return (
    <>
      {/* Main Artist Profile Modal */}
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {artist.avatar && (
                  <img
                    src={artist.avatar}
                    alt={`${artist.firstname} ${artist.lastname}`}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <DialogTitle className="text-2xl font-bold text-artist">
                    {artist.firstname} {artist.lastname}
                    {artist.is_verified && (
                      <span className="ml-2 inline-flex items-center">
                        <svg
                          className="h-5 w-5 text-verified-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-label="Verified artist"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </DialogTitle>
                  <div className="flex items-center space-x-4 text-sm text-secondary-600 mt-1">
                    {artist.salon && <span className="text-salon-name">{artist.salon.name}</span>}
                    {artist.city && <span>{artist.city.name}</span>}
                    {artist.is_guest && <Badge variant="secondary">Guest Artist</Badge>}
                    {artist.editor_pick && <Badge variant="default">Editor's Pick</Badge>}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFavoriteClick?.(artist.id)}
                  aria-label="Add to favorites"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {artist.favorite_count > 0 && (
                    <span className="ml-1">{artist.favorite_count}</span>
                  )}
                </Button>
              </div>
            </div>
          </DialogHeader>

          <DialogDescription className="sr-only">
            Artist profile for {artist.firstname} {artist.lastname} showing their portfolio and
            contact information.
          </DialogDescription>

          <Tabs defaultValue="portfolio" className="mt-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="portfolio" className="mt-4">
              {tattoos.length > 0 ? (
                <div className="gallery-grid">
                  {tattoos.map((tattoo, index) => (
                    <div
                      key={tattoo.id}
                      className="gallery-item cursor-pointer group"
                      onClick={() => handleImageClick(index)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleImageClick(index)
                        }
                      }}
                      aria-label={`View tattoo image ${index + 1} of ${tattoos.length}${tattoo.description ? `: ${tattoo.description}` : ''}`}
                    >
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={tattoo.photo}
                          alt={
                            tattoo.alt_text || `Tattoo by ${artist.firstname} ${artist.lastname}`
                          }
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                        {tattoo.is_flash && (
                          <Badge className="absolute top-2 left-2 badge-flash">
                            Flash
                            {tattoo.price && <span className="ml-1">${tattoo.price}</span>}
                          </Badge>
                        )}
                        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex flex-wrap gap-1">
                            {tattoo.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag.id} variant="secondary" className="text-xs">
                                {tag.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-secondary-500">
                  <svg
                    className="mx-auto h-12 w-12 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p>No portfolio images available yet.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="about" className="mt-4 space-y-4">
              {artist.bio && (
                <div>
                  <h4 className="font-semibold mb-2">About</h4>
                  <p className="text-secondary-700 leading-relaxed">{artist.bio}</p>
                </div>
              )}

              {artist.gpt_styles && artist.gpt_styles.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {artist.gpt_styles.map((style, index) => (
                      <Badge key={index} variant="outline">
                        {style}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-secondary-500">Profile Views</span>
                  <p className="text-lg font-semibold">{artist.view_count.toLocaleString()}</p>
                </div>
                {artist.instagram_followers && (
                  <div>
                    <span className="font-medium text-secondary-500">Instagram Followers</span>
                    <p className="text-lg font-semibold">
                      {formatFollowers(artist.instagram_followers)}
                    </p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-secondary-500">Portfolio</span>
                  <p className="text-lg font-semibold">{tattoos.length} pieces</p>
                </div>
              </div>

              {artist.instagram_url && (
                <div>
                  <a
                    href={artist.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                    <span>@{artist.instagram_handle}</span>
                  </a>
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact" className="mt-4">
              <div className="space-y-4">
                <div className="text-center">
                  <h4 className="text-lg font-semibold mb-2">Ready to get tattooed?</h4>
                  <p className="text-secondary-600 mb-4">
                    Contact {artist.firstname} to discuss your tattoo ideas and book a consultation.
                  </p>
                  <Button
                    onClick={() => onContactClick?.(artist.id)}
                    className="btn-primary"
                    size="lg"
                  >
                    Contact {artist.firstname}
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="text-sm text-secondary-500 text-center">
                  <p>
                    By contacting this artist, you agree to our terms of service. Response times may
                    vary based on the artist's availability.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Overlay */}
      {isImageGalleryOpen && selectedImageIndex !== null && (
        <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
          <DialogContent className="max-w-6xl max-h-[95vh] p-0 bg-black/95">
            <div className="relative flex items-center justify-center h-full">
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <div className="flex flex-col items-center justify-center max-h-full max-w-full">
                <img
                  src={tattoos[selectedImageIndex].photo}
                  alt={
                    tattoos[selectedImageIndex].alt_text ||
                    `Tattoo by ${artist.firstname} ${artist.lastname}`
                  }
                  className="max-h-[80vh] max-w-full object-contain"
                />

                {tattoos[selectedImageIndex].description && (
                  <div className="mt-4 px-6 text-white text-center">
                    <p>{tattoos[selectedImageIndex].description}</p>
                  </div>
                )}

                <div className="mt-2 flex flex-wrap gap-2 justify-center px-6">
                  {tattoos[selectedImageIndex].tags.map((tag) => (
                    <Badge key={tag.id} variant="outline" className="text-white border-white">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>

              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next image"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
                {selectedImageIndex + 1} of {tattoos.length}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

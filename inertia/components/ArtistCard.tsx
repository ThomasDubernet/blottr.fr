import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Heart, MapPin, Star, Instagram, ExternalLink } from 'lucide-react'
import { cn } from '~/lib/utils'

interface Artist {
  id: string
  firstname: string
  lastname: string
  avatar?: string
  bio?: string
  instagram_handle?: string
  instagram_followers?: number
  salon?: {
    name: string
    city: string
  }
  city?: {
    name: string
  }
  tags?: Array<{
    name: string
    category: string
  }>
  view_count?: number
  favorite_count?: number
  is_verified?: boolean
  verification_status: 'scraped' | 'contacted' | 'onboarding' | 'verified'
  tattoo_count?: number
  rating?: number
}

interface ArtistCardProps {
  artist: Artist
  variant?: 'default' | 'compact' | 'featured'
  showContact?: boolean
  showFavorite?: boolean
  onContact?: (artistId: string) => void
  onFavorite?: (artistId: string) => void
  onViewProfile?: (artistId: string) => void
  className?: string
}

export const ArtistCard: React.FC<ArtistCardProps> = ({
  artist,
  variant = 'default',
  showContact = true,
  showFavorite = true,
  onContact,
  onFavorite,
  onViewProfile,
  className,
}) => {
  const getInitials = (firstname: string, lastname: string) => {
    return `${firstname.charAt(0)}${lastname.charAt(0)}`.toUpperCase()
  }

  const formatFollowerCount = (count?: number) => {
    if (!count) return null
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const getVerificationBadgeColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'onboarding':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const renderCompactCard = () => (
    <Card className={cn('artist-card w-full max-w-sm hover:shadow-card-hover transition-all', className)}>
      <CardContent className="p-responsive-md">
        <div className="flex items-center gap-responsive-sm">
          <Avatar className="artist-avatar">
            <AvatarImage src={artist.avatar} alt={`${artist.firstname} ${artist.lastname}`} />
            <AvatarFallback>{getInitials(artist.firstname, artist.lastname)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-responsive-xs">
              <h3 className="text-responsive-sm font-semibold truncate artist-name">
                {artist.firstname} {artist.lastname}
              </h3>
              {artist.is_verified && (
                <Badge variant="outline" className="badge-verified text-responsive-xs">
                  ✓
                </Badge>
              )}
            </div>

            <div className="flex items-center text-responsive-xs text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate salon-name">
                {artist.salon?.name
                  ? `${artist.salon.name}, ${artist.salon.city}`
                  : artist.city?.name}
              </span>
            </div>

            {artist.instagram_handle && (
              <div className="flex items-center text-responsive-xs text-muted-foreground mt-1">
                <Instagram className="h-3 w-3 mr-1" />
                <span className="truncate">@{artist.instagram_handle}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col space-responsive-xs">
            {showFavorite && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFavorite?.(artist.id)}
                className="p-1 h-8 w-8 focus-ring"
              >
                <Heart className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderFeaturedCard = () => (
    <Card
      className={cn(
        'artist-card w-full max-w-md hover:shadow-gallery-hover transition-all duration-200 border-2 border-primary/20',
        className
      )}
    >
      <CardHeader className="p-responsive-md">
        <div className="flex items-center justify-between">
          <Badge
            className={getVerificationBadgeColor(artist.verification_status)}
            variant="outline"
          >
            Featured Artist
          </Badge>
          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite?.(artist.id)}
              className="p-1 h-8 w-8 hover:bg-red-50 hover:text-red-600 focus-ring"
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-responsive-md">
        <div className="text-center space-responsive-md">
          <Avatar className="artist-avatar-lg mx-auto">
            <AvatarImage src={artist.avatar} alt={`${artist.firstname} ${artist.lastname}`} />
            <AvatarFallback className="text-responsive-lg">
              {getInitials(artist.firstname, artist.lastname)}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center justify-center gap-responsive-xs">
            <h3 className="heading-section artist-name">
              {artist.firstname} {artist.lastname}
            </h3>
            {artist.is_verified && (
              <Badge className="badge-verified" variant="outline">
                ✓ Verified
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-center text-responsive-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="salon-name">
              {artist.salon?.name
                ? `${artist.salon.name}, ${artist.salon.city}`
                : artist.city?.name}
            </span>
          </div>
        </div>

        {artist.bio && (
          <p className="text-responsive-sm text-muted-foreground text-center line-clamp-2 mt-4">{artist.bio}</p>
        )}

        <div className="flex justify-center gap-responsive-lg text-responsive-sm text-muted-foreground mt-4">
          {artist.tattoo_count && (
            <div className="text-center">
              <div className="font-semibold text-foreground">{artist.tattoo_count}</div>
              <div>Tattoos</div>
            </div>
          )}
          {artist.instagram_followers && (
            <div className="text-center">
              <div className="font-semibold text-foreground">
                {formatFollowerCount(artist.instagram_followers)}
              </div>
              <div>Followers</div>
            </div>
          )}
          {artist.rating && (
            <div className="text-center">
              <div className="font-semibold text-foreground flex items-center">
                {artist.rating.toFixed(1)}{' '}
                <Star className="h-3 w-3 ml-1 fill-yellow-400 text-yellow-400" />
              </div>
              <div>Rating</div>
            </div>
          )}
        </div>

        {artist.tags && artist.tags.length > 0 && (
          <div className="flex flex-wrap gap-responsive-xs justify-center mt-4">
            {artist.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-responsive-xs">
                {tag.name}
              </Badge>
            ))}
            {artist.tags.length > 3 && (
              <Badge variant="outline" className="text-responsive-xs">
                +{artist.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-responsive-sm p-responsive-md">
        <Button variant="outline" className="flex-1 btn-responsive focus-ring" onClick={() => onViewProfile?.(artist.id)}>
          <ExternalLink className="h-4 w-4 mr-2" />
          View Profile
        </Button>
        {showContact && (
          <Button className="flex-1 btn-responsive focus-ring" onClick={() => onContact?.(artist.id)}>
            Contact Artist
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  const renderDefaultCard = () => (
    <Card className={cn('artist-card w-full max-w-sm hover:shadow-card-hover transition-all', className)}>
      <CardHeader className="p-responsive-md">
        <div className="flex items-center gap-responsive-sm">
          <Avatar className="artist-avatar">
            <AvatarImage src={artist.avatar} alt={`${artist.firstname} ${artist.lastname}`} />
            <AvatarFallback>{getInitials(artist.firstname, artist.lastname)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-responsive-xs">
              <h3 className="text-responsive-lg font-semibold truncate artist-name">
                {artist.firstname} {artist.lastname}
              </h3>
              {artist.is_verified && (
                <Badge className="badge-verified" variant="outline">
                  ✓
                </Badge>
              )}
            </div>

            <div className="flex items-center text-responsive-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="truncate salon-name">
                {artist.salon?.name
                  ? `${artist.salon.name}, ${artist.salon.city}`
                  : artist.city?.name}
              </span>
            </div>
          </div>

          {showFavorite && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFavorite?.(artist.id)}
              className="p-1 h-8 w-8 hover:bg-red-50 hover:text-red-600 focus-ring"
            >
              <Heart className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-responsive-md space-responsive-sm">
        {artist.bio && <p className="text-responsive-sm text-muted-foreground line-clamp-2">{artist.bio}</p>}

        <div className="flex justify-between text-responsive-sm text-muted-foreground">
          {artist.instagram_handle && (
            <div className="flex items-center">
              <Instagram className="h-4 w-4 mr-1" />
              <span>@{artist.instagram_handle}</span>
            </div>
          )}
          {artist.instagram_followers && (
            <div className="flex items-center">
              <span>{formatFollowerCount(artist.instagram_followers)} followers</span>
            </div>
          )}
        </div>

        {artist.tags && artist.tags.length > 0 && (
          <div className="flex flex-wrap gap-responsive-xs">
            {artist.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-responsive-xs">
                {tag.name}
              </Badge>
            ))}
            {artist.tags.length > 3 && (
              <Badge variant="outline" className="text-responsive-xs">
                +{artist.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Badge
          variant="outline"
          className={`text-responsive-xs ${getVerificationBadgeColor(artist.verification_status)}`}
        >
          {artist.verification_status === 'verified'
            ? 'Verified Artist'
            : artist.verification_status === 'onboarding'
              ? 'Onboarding'
              : artist.verification_status === 'contacted'
                ? 'Contacted'
                : 'Discovered'}
        </Badge>
      </CardContent>

      <CardFooter className="flex gap-responsive-sm p-responsive-md">
        <Button variant="outline" className="flex-1 btn-responsive focus-ring" onClick={() => onViewProfile?.(artist.id)}>
          View Profile
        </Button>
        {showContact && (
          <Button className="flex-1 btn-responsive focus-ring" onClick={() => onContact?.(artist.id)}>
            Contact
          </Button>
        )}
      </CardFooter>
    </Card>
  )

  switch (variant) {
    case 'compact':
      return renderCompactCard()
    case 'featured':
      return renderFeaturedCard()
    default:
      return renderDefaultCard()
  }
}

export default ArtistCard

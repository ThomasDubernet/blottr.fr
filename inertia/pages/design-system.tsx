import React from 'react'
import { Head } from '@inertiajs/react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Separator } from '~/components/ui/separator'
import { ArtistCard } from '~/components/ArtistCard'
import { TattooGallery } from '~/components/TattooGallery'
import { Heart, Star, MapPin, Instagram, Eye, ExternalLink } from 'lucide-react'

export default function DesignSystemPage() {
  // Mock data for component showcase
  const mockArtist = {
    id: '1',
    firstname: 'Sophie',
    lastname: 'Martin',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    bio: 'Specializing in fine line and minimalist tattoos. 8+ years experience in Parisian studios.',
    instagram_handle: 'sophie.ink',
    instagram_followers: 25000,
    salon: {
      name: 'Atelier Noir',
      city: 'Paris',
    },
    city: { name: 'Paris' },
    tags: [
      { name: 'Fine Line', category: 'style' },
      { name: 'Minimalist', category: 'style' },
      { name: 'Black Work', category: 'color' },
    ],
    view_count: 2150,
    favorite_count: 156,
    is_verified: true,
    verification_status: 'verified' as const,
    tattoo_count: 89,
    rating: 4.9,
  }

  const mockTattoos = [
    {
      id: '1',
      photo: 'https://images.unsplash.com/photo-1565058379802-bbe93b2669c1?w=400&h=400&fit=crop',
      alt_text: 'Fine line rose tattoo',
      description: 'Delicate rose with fine line technique',
      is_flash: false,
      view_count: 450,
      like_count: 32,
      tags: [
        { name: 'Rose', category: 'theme' },
        { name: 'Fine Line', category: 'style' },
      ],
      artist: {
        firstname: 'Sophie',
        lastname: 'Martin',
        instagram_handle: 'sophie.ink',
      },
    },
    {
      id: '2',
      photo: 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=500&fit=crop',
      alt_text: 'Geometric mandala tattoo',
      description: 'Intricate geometric mandala design',
      is_flash: true,
      price: 180,
      view_count: 680,
      like_count: 54,
      tags: [
        { name: 'Geometric', category: 'style' },
        { name: 'Mandala', category: 'theme' },
      ],
      artist: {
        firstname: 'Sophie',
        lastname: 'Martin',
        instagram_handle: 'sophie.ink',
      },
    },
  ]

  return (
    <>
      <Head title="Design System - Blottr" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Blottr Design System</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A comprehensive component library designed for the tattoo artist discovery and booking
              platform.
            </p>
          </div>

          {/* Color Palette */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Primary Colors */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Primary</h4>
                  <div className="space-y-2">
                    <div className="h-12 bg-primary rounded flex items-center justify-center text-primary-foreground text-sm">
                      Primary
                    </div>
                    <div className="h-8 bg-primary/80 rounded"></div>
                    <div className="h-8 bg-primary/60 rounded"></div>
                    <div className="h-8 bg-primary/40 rounded"></div>
                  </div>
                </div>

                {/* Success Colors */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Success</h4>
                  <div className="space-y-2">
                    <div className="h-12 bg-green-500 rounded flex items-center justify-center text-white text-sm">
                      Success
                    </div>
                    <div className="h-8 bg-green-400 rounded"></div>
                    <div className="h-8 bg-green-300 rounded"></div>
                    <div className="h-8 bg-green-200 rounded"></div>
                  </div>
                </div>

                {/* Warning Colors */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Warning</h4>
                  <div className="space-y-2">
                    <div className="h-12 bg-yellow-500 rounded flex items-center justify-center text-white text-sm">
                      Warning
                    </div>
                    <div className="h-8 bg-yellow-400 rounded"></div>
                    <div className="h-8 bg-yellow-300 rounded"></div>
                    <div className="h-8 bg-yellow-200 rounded"></div>
                  </div>
                </div>

                {/* Gray Scale */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Gray Scale</h4>
                  <div className="space-y-2">
                    <div className="h-12 bg-gray-900 rounded flex items-center justify-center text-white text-sm">
                      Gray 900
                    </div>
                    <div className="h-8 bg-gray-600 rounded"></div>
                    <div className="h-8 bg-gray-400 rounded"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Typography */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Typography</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">Heading 1 - 36px Bold</h1>
                  <p className="text-sm text-gray-600">Perfect for page titles and hero sections</p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Heading 2 - 24px Semibold
                  </h2>
                  <p className="text-sm text-gray-600">Great for section headers</p>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Heading 3 - 18px Medium</h3>
                  <p className="text-sm text-gray-600">Card titles and subsections</p>
                </div>
                <div>
                  <p className="text-base text-gray-900">Body text - 16px Regular</p>
                  <p className="text-sm text-gray-600">
                    The standard body text for descriptions and content
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Small text - 14px Regular</p>
                  <p className="text-xs text-gray-500">
                    Used for captions and secondary information
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buttons */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Variants */}
                <div>
                  <h4 className="font-medium mb-3">Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="default">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>

                {/* Sizes */}
                <div>
                  <h4 className="font-medium mb-3">Sizes</h4>
                  <div className="flex items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* With Icons */}
                <div>
                  <h4 className="font-medium mb-3">With Icons</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button>
                      <Heart className="mr-2 h-4 w-4" />
                      Favorite Artist
                    </Button>
                    <Button variant="outline">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      View Profile
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Instagram className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards & Badges */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Cards & Badges</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Basic Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Artist Profile
                      <Badge variant="secondary">Verified</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop" />
                        <AvatarFallback>SM</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">Sophie Martin</h3>
                        <p className="text-sm text-gray-600">Fine Line Specialist</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Badges Showcase */}
                <div>
                  <h4 className="font-medium mb-3">Badge Variants</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge className="bg-green-100 text-green-800 border-green-200">Verified</Badge>
                    <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Pending
                    </Badge>
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200">Flash</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Artist Card Showcase */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Artist Card Components</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <ArtistCard
                artist={mockArtist}
                variant="default"
                onContact={(id) => console.log('Contact artist:', id)}
                onFavorite={(id) => console.log('Favorite artist:', id)}
                onViewProfile={(id) => console.log('View profile:', id)}
              />
              <ArtistCard
                artist={mockArtist}
                variant="compact"
                onContact={(id) => console.log('Contact artist:', id)}
                onFavorite={(id) => console.log('Favorite artist:', id)}
              />
              <ArtistCard
                artist={mockArtist}
                variant="featured"
                onContact={(id) => console.log('Contact artist:', id)}
                onFavorite={(id) => console.log('Favorite artist:', id)}
                onViewProfile={(id) => console.log('View profile:', id)}
              />
            </div>
          </div>

          <Separator className="my-8" />

          {/* Tattoo Gallery Showcase */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-6">Tattoo Gallery Component</h2>
            <TattooGallery
              tattoos={mockTattoos}
              layout="grid"
              columns={2}
              showArtistInfo={true}
              showStats={true}
              onTattooLike={(id) => console.log('Like tattoo:', id)}
              onTattooView={(id) => console.log('View tattoo:', id)}
            />
          </div>

          {/* Component Status */}
          <Card>
            <CardHeader>
              <CardTitle>Component Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3">Core UI Components</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Button</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Card</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Dialog</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Form Components</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Toast System</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Blottr Components</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>ArtistCard</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>TattooGallery</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>BookingCalendar</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>ContactForm</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Ready</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Advanced Components</span>
                      <Badge className="bg-green-100 text-green-800">Complete</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

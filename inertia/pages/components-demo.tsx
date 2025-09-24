import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import {
  ArtistCard,
  TattooGallery,
  StyleTag,
  StyleTags,
  BookingCalendar,
  ContactForm,
  ReviewCard,
  ReviewList,
  ReviewSummary,
  PortfolioUploader,
} from '~/components'

// Mock data for demonstrations
const mockArtist = {
  id: '1',
  firstname: 'John',
  lastname: 'Doe',
  bio: 'Specializing in traditional and neo-traditional tattoo styles with over 10 years of experience.',
  avatar:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  city: { name: 'Paris' },
  salon: { name: 'Ink Masters Studio' },
  instagram_handle: 'johndoe_tattoo',
  is_verified: true,
  is_claimed: true,
  view_count: 1250,
  favorite_count: 89,
  gpt_styles: ['Traditional', 'Neo-Traditional', 'Black & Grey'],
}

const mockTattoos = Array.from({ length: 6 }, (_, i) => ({
  id: `tattoo-${i}`,
  photo: `https://images.unsplash.com/photo-${1550000000000 + i}?w=400&h=600&fit=crop`,
  alt_text: `Beautiful tattoo ${i + 1}`,
  description: `Amazing ${i % 2 === 0 ? 'traditional' : 'neo-traditional'} tattoo design featuring intricate details and bold colors.`,
  is_flash: i % 3 === 0,
  is_featured: i % 4 === 0,
  price: i % 3 === 0 ? 150 + i * 50 : undefined,
  view_count: Math.floor(Math.random() * 1000) + 100,
  like_count: Math.floor(Math.random() * 100) + 10,
  artist: {
    id: '1',
    firstname: 'John',
    lastname: 'Doe',
    slug: 'john-doe-paris',
  },
  tags: [
    { id: '1', name: 'Traditional', slug: 'traditional' },
    { id: '2', name: 'Color', slug: 'color' },
  ].slice(0, Math.floor(Math.random() * 2) + 1),
}))

const mockTags = [
  { id: '1', name: 'Traditional', slug: 'traditional', category: 'style', usage_count: 245 },
  {
    id: '2',
    name: 'Neo-Traditional',
    slug: 'neo-traditional',
    category: 'style',
    usage_count: 189,
  },
  { id: '3', name: 'Realism', slug: 'realism', category: 'style', usage_count: 167 },
  { id: '4', name: 'Black & Grey', slug: 'black-grey', category: 'color', usage_count: 203 },
  { id: '5', name: 'Arm', slug: 'arm', category: 'body_part', usage_count: 156 },
  { id: '6', name: 'Roses', slug: 'roses', category: 'theme', usage_count: 134 },
]

const mockReviews = Array.from({ length: 3 }, (_, i) => ({
  id: `review-${i}`,
  rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
  comment: [
    'Absolutely amazing experience! John is incredibly talented and professional. The tattoo turned out even better than I imagined.',
    'Great attention to detail and really listened to what I wanted. The studio is clean and welcoming. Highly recommend!',
    'John did an incredible job on my sleeve. His traditional style is unmatched. Already planning my next piece with him.',
  ][i],
  is_verified: i % 2 === 0,
  created_at: new Date(Date.now() - i * 86400000 * 7).toISOString(),
  client: {
    id: `client-${i}`,
    name: ['Sarah M.', 'Mike R.', 'Emma K.'][i],
    initials: ['SM', 'MR', 'EK'][i],
  },
  artist: mockArtist,
  helpful_count: Math.floor(Math.random() * 10) + 1,
  response:
    i === 0
      ? {
          id: 'response-1',
          message:
            'Thank you so much Sarah! It was a pleasure working on your piece. Welcome to the Ink Masters family!',
          created_at: new Date(Date.now() - 86400000 * 6).toISOString(),
        }
      : undefined,
}))

const mockTimeSlots = {
  '2025-01-15': [
    { id: '1', start_time: '09:00:00', end_time: '11:00:00', available: true, price: 200 },
    { id: '2', start_time: '11:30:00', end_time: '13:30:00', available: false },
    { id: '3', start_time: '14:00:00', end_time: '16:00:00', available: true, price: 200 },
  ],
  '2025-01-16': [
    { id: '4', start_time: '10:00:00', end_time: '12:00:00', available: true, price: 200 },
    { id: '5', start_time: '13:00:00', end_time: '15:00:00', available: true, price: 200 },
  ],
  '2025-01-17': [
    { id: '6', start_time: '09:00:00', end_time: '11:00:00', available: true, price: 200 },
  ],
}

export default function ComponentsDemo() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTimeSlot, setSelectedTimeSlot] = useState()
  const [contactFormVisible, setContactFormVisible] = useState(false)

  return (
    <>
      <Head title="UI Components Demo" />

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <h1 className="text-3xl font-bold text-gray-900">Blottr UI Components</h1>
              <p className="mt-2 text-gray-600">
                Production-ready UI components for the tattoo industry platform
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-16">
            {/* Artist Cards */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Artist Cards</h2>
                <p className="text-gray-600">
                  Display artist profiles with verification badges and engagement metrics
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <ArtistCard artist={mockArtist} variant="default" />
                <ArtistCard artist={{ ...mockArtist, is_verified: false }} variant="compact" />
                <ArtistCard artist={mockArtist} variant="featured" />
              </div>
            </section>

            {/* Style Tags */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Style Tags</h2>
                <p className="text-gray-600">
                  Categorization tags for tattoo styles with different variants and colors
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Individual Tags</h3>
                  <div className="flex flex-wrap gap-3">
                    {mockTags.slice(0, 4).map((tag) => (
                      <StyleTag key={tag.id} tag={tag} variant="default" />
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Different Variants</h3>
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-3">
                      <StyleTag tag={mockTags[0]} variant="default" />
                      <StyleTag tag={mockTags[0]} variant="outline" />
                      <StyleTag tag={mockTags[0]} variant="minimal" />
                      <StyleTag tag={mockTags[0]} variant="pill" />
                      <StyleTag tag={mockTags[0]} variant="badge" />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Tag Collection</h3>
                  <StyleTags
                    tags={mockTags}
                    variant="default"
                    showCount={true}
                    interactive={true}
                    maxTags={5}
                  />
                </div>
              </div>
            </section>

            {/* Tattoo Gallery */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Tattoo Gallery</h2>
                <p className="text-gray-600">
                  Masonry layout for portfolio images with interactive features
                </p>
              </div>

              <TattooGallery
                tattoos={mockTattoos}
                columns={3}
                showDetails={true}
                showArtist={true}
                hasMore={true}
              />
            </section>

            {/* Reviews */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews & Testimonials</h2>
                <p className="text-gray-600">
                  Client testimonial display with ratings and responses
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ReviewList reviews={mockReviews} showArtist={true} showResponse={true} />
                </div>

                <div>
                  <ReviewSummary
                    averageRating={4.7}
                    totalReviews={156}
                    ratingDistribution={{
                      5: 89,
                      4: 45,
                      3: 15,
                      2: 5,
                      1: 2,
                    }}
                  />
                </div>
              </div>
            </section>

            {/* Booking Calendar */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Calendar</h2>
                <p className="text-gray-600">
                  Appointment scheduling interface with time slot management
                </p>
              </div>

              <div className="max-w-2xl">
                <BookingCalendar
                  artistId="1"
                  availableSlots={mockTimeSlots}
                  selectedDate={selectedDate}
                  selectedTimeSlot={selectedTimeSlot}
                  onDateSelect={setSelectedDate}
                  onTimeSlotSelect={setSelectedTimeSlot}
                  onBookingConfirm={(date, slot) => {
                    alert(
                      `Booking confirmed for ${date.toLocaleDateString()} at ${slot.start_time}`
                    )
                  }}
                />
              </div>
            </section>

            {/* Contact Form */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Form</h2>
                <p className="text-gray-600">
                  Multi-step artist contact workflow with project details
                </p>
              </div>

              {!contactFormVisible ? (
                <button
                  onClick={() => setContactFormVisible(true)}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Open Contact Form
                </button>
              ) : (
                <div className="max-w-2xl">
                  <ContactForm
                    artist={mockArtist}
                    user={{ id: 'user-1', email: 'client@example.com' }}
                    onCancel={() => setContactFormVisible(false)}
                    onSuccess={() => {
                      alert('Contact request sent successfully!')
                      setContactFormVisible(false)
                    }}
                  />
                </div>
              )}
            </section>

            {/* Portfolio Uploader */}
            <section>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Portfolio Uploader</h2>
                <p className="text-gray-600">Drag & drop image upload with metadata management</p>
              </div>

              <div className="max-w-4xl">
                <PortfolioUploader
                  artistId="1"
                  existingTattoos={mockTattoos.slice(0, 3)}
                  onUploadComplete={(files) => {
                    console.log('Upload complete:', files)
                    alert(`${files.length} files uploaded successfully!`)
                  }}
                  onError={(error) => {
                    console.error('Upload error:', error)
                    alert(`Upload error: ${error}`)
                  }}
                />
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

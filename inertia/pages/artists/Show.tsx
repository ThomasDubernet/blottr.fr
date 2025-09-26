import React, { useState } from 'react'
import { Head } from '@inertiajs/react'
import { MainLayout } from '~/components/layout/MainLayout'
import { Artist } from '~/components/discovery'
import { Button } from '~/components/ui'
import { ContactModal, ContactInquiry } from '~/components/forms'
import { formService } from '~/services/form_service'
import { cn } from '~/lib/utils'

interface ArtistShowProps {
  user?: {
    id: string
    email: string
    role: 'client' | 'artist'
  } | null
  artist: Artist & {
    fullBio?: string
    portfolio: {
      id: string
      title: string
      imageUrl: string
      description?: string
      styles: string[]
      createdAt: string
      likes: number
      isLiked: boolean
    }[]
    stats: {
      totalTattoos: number
      totalLikes: number
      experienceYears: number
      averageRating: number
      totalReviews: number
    }
    contact: {
      phone?: string
      email?: string
      instagram?: string
      website?: string
      address?: string
      workingHours?: string
    }
    reviews: {
      id: string
      userName: string
      rating: number
      comment: string
      createdAt: string
      userAvatar?: string
    }[]
  }
}

export default function ArtistShow({ user, artist }: ArtistShowProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'contact'>('portfolio')
  const [isFavorited, setIsFavorited] = useState(false)
  const [contactModalOpen, setContactModalOpen] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited)
    // TODO: Implement API call
  }

  const handleInquiry = () => {
    setContactModalOpen(true)
  }

  const handleContactSubmit = async (inquiry: ContactInquiry) => {
    try {
      const result = await formService.submitContactInquiry(inquiry, artist.id)
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message })
        setTimeout(() => setSubmitMessage(null), 5000)
      } else {
        setSubmitMessage({ type: 'error', text: result.message })
        setTimeout(() => setSubmitMessage(null), 5000)
      }
    } catch (error) {
      setSubmitMessage({
        type: 'error',
        text: "Une erreur est survenue lors de l'envoi de votre demande.",
      })
      setTimeout(() => setSubmitMessage(null), 5000)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${artist.name} - Tatoueur`,
          text: `Découvrez le portfolio de ${artist.name}`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <MainLayout
      title={`${artist.name} - Artiste Tatoueur à ${artist.location}`}
      description={artist.fullBio || artist.bio}
      user={user}
    >
      <Head title={`${artist.name} - Blottr`} />

      {/* Artist Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Artist Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-600">
                {artist.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-900">{artist.name}</h1>
                {artist.verified && (
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-2">📍 {artist.location}</p>
              <div className="flex items-center gap-4">
                {artist.rating && (
                  <div className="flex items-center">
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
                    <span className="ml-1 text-sm text-gray-600">
                      {artist.rating} ({artist.stats.totalReviews} avis)
                    </span>
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  {artist.stats.experienceYears} ans d'expérience
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 md:ml-auto">
            <Button
              variant="outline"
              onClick={handleFavoriteToggle}
              className={cn(isFavorited && 'border-red-500 text-red-500')}
            >
              <svg
                className="w-4 h-4 mr-1"
                fill={isFavorited ? 'currentColor' : 'none'}
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
              {isFavorited ? 'Favoris' : 'Ajouter aux favoris'}
            </Button>

            <Button variant="outline" onClick={handleShare}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                />
              </svg>
              Partager
            </Button>

            <Button onClick={handleInquiry}>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Faire une demande
            </Button>
          </div>
        </div>

        {/* Artist Bio */}
        {artist.fullBio && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-700 leading-relaxed">{artist.fullBio}</p>
          </div>
        )}

        {/* Style Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {artist.styles.map((style) => (
            <span
              key={style}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
            >
              {style}
            </span>
          ))}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{artist.stats.totalTattoos}</div>
            <div className="text-sm text-gray-600">Tatouages réalisés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{artist.stats.totalLikes}</div>
            <div className="text-sm text-gray-600">Likes reçus</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{artist.stats.experienceYears}</div>
            <div className="text-sm text-gray-600">Années d'expérience</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {artist.stats.averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Note moyenne</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'portfolio', label: 'Portfolio', count: artist.portfolio.length },
              { key: 'reviews', label: 'Avis', count: artist.reviews.length },
              { key: 'contact', label: 'Contact', count: null },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.portfolio.map((tattoo) => (
                <div
                  key={tattoo.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="aspect-[3/4] bg-gray-200 relative">
                    <img
                      src={tattoo.imageUrl}
                      alt={tattoo.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-2 right-2">
                      <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors">
                        <svg
                          className="w-4 h-4 text-gray-700"
                          fill="none"
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
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900 mb-1">{tattoo.title}</h3>
                    {tattoo.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {tattoo.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{tattoo.likes} likes</span>
                      <span>{new Date(tattoo.createdAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {artist.reviews.map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-gray-600">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900">{review.userName}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={cn(
                                'w-4 h-4',
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                              )}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de contact</h3>
                <div className="space-y-3">
                  {artist.contact.phone && (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <span className="text-gray-700">{artist.contact.phone}</span>
                    </div>
                  )}
                  {artist.contact.email && (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-700">{artist.contact.email}</span>
                    </div>
                  )}
                  {artist.contact.address && (
                    <div className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-gray-700">{artist.contact.address}</span>
                    </div>
                  )}
                </div>

                {artist.contact.workingHours && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-2">Horaires d'ouverture</h4>
                    <p className="text-gray-700">{artist.contact.workingHours}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h3>
                <div className="space-y-3">
                  {artist.contact.instagram && (
                    <a
                      href={`https://instagram.com/${artist.contact.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987s11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.611-3.197-1.559-.187-.237-.318-.507-.39-.801-.072-.294-.085-.6-.038-.9.047-.3.142-.588.28-.851.138-.263.318-.498.532-.694.428-.392.98-.626 1.583-.659.603-.034 1.18.128 1.668.454.488.325.869.8 1.101 1.371.231.571.304 1.204.21 1.827-.095.623-.377 1.207-.815 1.685-.437.478-1.01.827-1.656.984-.647.157-1.33.084-1.969-.211-.639-.295-1.194-.773-1.601-1.38-.407-.607-.648-1.315-.694-2.044-.046-.73.087-1.457.386-2.103.299-.646.747-1.179 1.299-1.544.552-.365 1.188-.551 1.844-.537.656.014 1.28.225 1.81.612.53.387.948.939 1.212 1.598.264.659.367 1.386.297 2.105-.07.719-.318 1.402-.717 1.975-.399.573-.938 1.013-1.559 1.273-.621.26-1.298.329-1.958.201-.66-.128-1.274-.455-1.777-.946-.503-.491-.873-1.12-1.07-1.821-.197-.701-.218-1.44-.06-2.141.158-.7.466-1.338.892-1.847.426-.509.955-.869 1.533-1.044.578-.175 1.184-.157 1.754.052.57.209 1.077.563 1.468 1.025.391.462.651 1.013.752 1.595.101.582.04 1.176-.177 1.721-.217.545-.576 1.018-1.039 1.368-.463.35-1.007.566-1.575.625-.568.059-1.135-.046-1.643-.305-.508-.259-.937-.672-1.242-1.197-.305-.525-.477-1.137-.497-1.772-.02-.635.112-1.264.382-1.822.27-.558.666-1.024 1.146-1.351.48-.327 1.027-.503 1.582-.51.555-.007 1.108.156 1.6.472.492.316.907.77 1.201 1.313.294.543.459 1.153.478 1.766.019.613-.106 1.219-.361 1.756-.255.537-.637.99-1.107 1.312-.47.322-1.007.502-1.555.521-.548.019-1.092-.124-1.575-.414-.483-.29-.888-.709-1.172-1.213-.284-.504-.438-1.071-.446-1.644-.008-.573.135-1.142.414-1.648.279-.506.683-.928 1.169-1.221.486-.293 1.034-.453 1.587-.462.553-.009 1.102.135 1.59.416.488.281.9.688 1.191 1.178.291.49.452 1.041.466 1.596.014.555-.132 1.103-.423 1.585-.291.482-.713.876-1.219 1.139-.506.263-1.073.387-1.64.36-.567-.027-1.117-.187-1.593-.464-.476-.277-.862-.665-1.117-1.123-.255-.458-.37-.972-.333-1.487.037-.515.199-1.009.467-1.432.268-.423.632-.767 1.054-996.042-.178 1.06-.452 2.07-.812 3.022-.36.952-.801 1.839-1.314 2.647-.513.808-1.093 1.532-1.73 2.16-.637.628-1.327 1.156-2.057 1.574-.73.418-1.496.722-2.286.906-.79.184-1.598.246-2.407.185-.809-.061-1.613-.224-2.391-.485-.778-.261-1.526-.617-2.227-1.06-.701-.443-1.35-.968-1.933-1.564-.583-.596-1.098-1.259-1.532-1.974-.434-.715-.785-1.477-1.044-2.267-.259-.79-.424-1.603-.491-2.424-.067-.821-.035-1.646.094-2.454.129-.808.357-1.594.678-2.343.321-.749.729-1.456 1.215-2.106.486-.65 1.046-1.237 1.67-1.749.624-.512 1.307-.953 2.034-1.313.727-.36 1.494-.635 2.285-.818.791-.183 1.599-.274 2.41-.270.811.004 1.617.1 2.403.286.786.186 1.547.462 2.264.821.717.359 1.387.804 1.995 1.324.608.52 1.151 1.111 1.618 1.757.467.646.853 1.343 1.149 2.076.296.733.498 1.497.602 2.279.104.782.108 1.579.011 2.36-.097.781-.295 1.542-.588 2.268-.293.726-.681 1.413-1.155 2.045-.474.632-1.031 1.204-1.657 1.702-.626.498-1.318.919-2.061 1.252-.743.333-1.532.577-2.348.724-.816.147-1.653.197-2.491.148-.838-.049-1.672-.2-2.482-.449-.81-.249-1.59-.595-2.324-1.028-.734-.433-1.418-.95-2.037-1.538-.619-.588-1.168-1.244-1.636-1.954-.468-.71-.851-1.468-1.141-2.259-.29-.791-.484-1.611-.579-2.445-.095-.834-.089-1.677.017-2.505.106-.828.318-1.636.631-2.41.313-.774.723-1.51 1.222-2.194.499-.684 1.083-1.312 1.74-1.869.657-.557 1.383-1.038 2.162-1.432.779-.394 1.606-.697 2.463-.902.857-.205 1.74-.31 2.628-.314.888-.004 1.777.095 2.65.296.873.201 1.724.503 2.535.898.811.395 1.577.879 2.283 1.442.706.563 1.347 1.203 1.91 1.906.563.703 1.043 1.465 1.429 2.272.386.807.675 1.655.859 2.528.184.873.261 1.766.230 2.66-.031.894-.157 1.783-.375 2.648-.218.865-.529 1.701-.924 2.493-.395.792-.87 1.537-1.415 2.219-.545.682-1.156 1.296-1.821 1.829-.665.533-1.379.981-2.128 1.335-.749.354-1.529.609-2.326.758-.797.149-1.608.192-2.419.128-.811-.064-1.617-.222-2.397-.469-.78-.247-1.529-.582-2.23-995.995-.001-1.389-.285-2.734-.844-3.982-.559-1.248-1.38-2.378-2.434-3.331-1.054-.953-2.317-1.71-3.733-2.237-1.416-.527-2.961-.814-4.571-.848-1.61-.034-3.264.188-4.889.658-1.625.47-3.198 1.181-4.654 2.103-1.456.922-2.773 2.044-3.895 3.318-1.122 1.274-2.033 2.684-2.693 4.172-.66 1.488-1.058 3.036-1.175 4.581-.117 1.545.008 3.067.370 4.528.362 1.461.955 2.844 1.757 4.091.802 1.247 1.797 2.342 2.944 3.238.369 1.459.955 2.842 1.757 4.089z" />
                      </svg>
                      <span>@{artist.contact.instagram}</span>
                    </a>
                  )}
                  {artist.contact.website && (
                    <a
                      href={artist.contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
                        />
                      </svg>
                      <span>Site web</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        onSubmit={handleContactSubmit}
        artistId={artist.id}
        artistName={artist.name}
        defaultProjectType="consultation"
      />

      {/* Success/Error Message */}
      {submitMessage && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-6 py-4 rounded-lg shadow-lg ${
              submitMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-3">
              {submitMessage.type === 'success' ? (
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="text-sm font-medium">{submitMessage.text}</span>
              <button
                onClick={() => setSubmitMessage(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Development Note */}
      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800">
          <strong>Sprint 3 Complet:</strong> Page profil artiste avec portfolio, système de contact
          intégré et formulaire de demande multi-étapes. Fonctionnalités: favoris, partage social,
          et formulaires de consultation professionnels.
        </p>
      </div>
    </MainLayout>
  )
}

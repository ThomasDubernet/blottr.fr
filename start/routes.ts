/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.on('/').renderInertia('home')

// Artist routes
router.get('/artists/:slug', async ({ params, inertia }) => {
  // Mock artist data for testing the contact form
  const mockArtist = {
    id: '1',
    slug: params.slug,
    name: 'Hervé',
    displayName: 'Hervé',
    bio: "Artiste tatoueur spécialisé dans le style Trash Polka et Neo-traditional avec plus de 10 ans d'expérience.",
    location: 'Paris, France',
    priceRange: '€€€',
    specialties: ['Trash Polka', 'Neo-traditional'],
    styles: ['Trash Polka', 'Neo-traditional'],
    verified: true,
    isVerified: true,
    rating: 4.8,
    reviewCount: 127,
    viewCount: 1542,
    stats: {
      totalReviews: 127,
      experienceYears: 10,
      completedProjects: 450,
      averageRating: 4.8,
    },
    profileImage:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    coverImage: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800&h=400&fit=crop',
    portfolio: [
      {
        id: '1',
        imageUrl:
          'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop',
        title: 'Tattoo traditionnel',
        description: 'Un magnifique tattoo traditionnel',
      },
      {
        id: '2',
        imageUrl:
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
        title: 'Tattoo réaliste',
        description: 'Portrait réaliste en noir et blanc',
      },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/herve_tattoo',
      website: 'https://herve-tattoo.com',
    },
    salon: {
      name: 'Serrafine',
      address: '123 Rue de la Paix, 75001 Paris',
    },
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'Excellent travail, très professionnel !',
        author: 'Marie L.',
        date: '2024-01-15',
      },
      {
        id: '2',
        rating: 5,
        comment: 'Résultat parfait, je recommande !',
        author: 'Thomas K.',
        date: '2024-01-10',
      },
    ],
  }

  return inertia.render('artists/Show', {
    artist: mockArtist,
  })
})

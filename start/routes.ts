/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const ContactInquiriesController = () => import('#controllers/contact_inquiries_controller')

router.on('/').renderInertia('home')

// API Routes
router
  .group(() => {
    // Contact Inquiry routes - temporarily without middleware for testing
    router.post('/contact-inquiries', [ContactInquiriesController, 'store'])
    router.post('/contact-inquiries/quick', [ContactInquiriesController, 'storeQuick'])
    router.get('/contact-inquiries/:id', [ContactInquiriesController, 'show'])
    router.get('/health/contact-inquiries', [ContactInquiriesController, 'health'])
  })
  .prefix('/api')

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
      totalTattoos: 450,
      totalLikes: 2341,
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
        styles: ['Traditional'],
        createdAt: '2024-01-15',
        likes: 89,
        isLiked: false,
      },
      {
        id: '2',
        imageUrl:
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop',
        title: 'Tattoo réaliste',
        description: 'Portrait réaliste en noir et blanc',
        styles: ['Realistic'],
        createdAt: '2024-01-10',
        likes: 134,
        isLiked: false,
      },
      {
        id: '3',
        imageUrl:
          'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400&h=400&fit=crop',
        title: 'Trash Polka',
        description: 'Style signature avec éléments graphiques',
        styles: ['Trash Polka'],
        createdAt: '2024-01-05',
        likes: 67,
        isLiked: true,
      },
    ],
    socialLinks: {
      instagram: 'https://instagram.com/herve_tattoo',
      website: 'https://herve-tattoo.com',
    },
    contact: {
      phone: '+33 1 42 00 00 00',
      email: 'herve@serrafine-tattoo.com',
      instagram: 'https://instagram.com/herve_tattoo',
      website: 'https://herve-tattoo.com',
      address: '123 Rue de la Paix, 75001 Paris',
      workingHours: 'Lun-Ven: 10h-19h, Sam: 10h-17h',
    },
    salon: {
      name: 'Serrafine',
      address: '123 Rue de la Paix, 75001 Paris',
    },
    fullBio:
      "Artiste tatoueur passionné avec plus de 10 ans d'expérience dans l'art corporel. Spécialisé dans le style Trash Polka, je mélange harmonieusement les éléments réalistes avec des abstractions graphiques pour créer des œuvres uniques. Mon approche combine technique traditionnelle et innovation artistique, toujours dans le respect et la sécurité de mes clients.",
    reviews: [
      {
        id: '1',
        rating: 5,
        comment: 'Excellent travail, très professionnel !',
        userName: 'Marie L.',
        createdAt: '2024-01-15',
        userAvatar:
          'https://images.unsplash.com/photo-1494790108755-2616b612b372?w=40&h=40&fit=crop&crop=face',
      },
      {
        id: '2',
        rating: 5,
        comment: 'Résultat parfait, je recommande !',
        userName: 'Thomas K.',
        createdAt: '2024-01-10',
        userAvatar:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      },
      {
        id: '3',
        rating: 4,
        comment: 'Super expérience, accueil chaleureux et travail de qualité.',
        userName: 'Sophie R.',
        createdAt: '2024-01-08',
        userAvatar:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      },
    ],
  }

  return inertia.render('artists/Show', {
    artist: mockArtist,
  })
})

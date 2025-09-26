import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Salon, { SalonVerificationStatus } from '#models/salon'
import City from '#models/city'

export default class SalonSeeder extends BaseSeeder {
  async run() {
    // Get cities for salon locations
    const paris = await City.findBy('slug', 'paris')
    const lyon = await City.findBy('slug', 'lyon')
    const marseille = await City.findBy('slug', 'marseille')
    const bordeaux = await City.findBy('slug', 'bordeaux')
    const toulouse = await City.findBy('slug', 'toulouse')

    if (!paris || !lyon || !marseille || !bordeaux || !toulouse) {
      console.log('❌ Salons need cities to be seeded first')
      return
    }

    const salonsData = [
      // Paris Salons
      {
        name: 'Ink Palace Studio',
        slug: 'ink-palace-studio-paris',
        description: 'Studio de tatouage haut de gamme au cœur de Paris. Spécialisé dans le réalisme, le traditionnel et les créations personnalisées. Équipe d\'artistes expérimentés depuis 2010.',
        shortDescription: 'Studio parisien spécialisé en réalisme et traditionnel',
        email: 'contact@inkpalace.fr',
        phone: '+33142365478',
        website: 'https://www.inkpalace.fr',
        cityId: paris.id,
        address: '15 rue de Rivoli',
        postalCode: '75001',
        latitude: 48.8566,
        longitude: 2.3522,
        openingHours: {
          monday: { isOpen: false },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '20:00' },
          saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
          sunday: { isOpen: false }
        },
        services: ['Tatouage traditionnel', 'Réalisme', 'Noir et blanc', 'Couleur', 'Cover-up', 'Retouches'],
        priceRangeMin: 120,
        priceRangeMax: 400,
        instagramHandle: '@inkpalaceparis',
        galleryImages: [
          'https://images.unsplash.com/photo-1565058379802-bbe93b2e6eb3?w=800',
          'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800'
        ],
        verificationStatus: SalonVerificationStatus.VERIFIED,
        verifiedAt: DateTime.fromISO('2024-01-15'),
        verifiedBy: 'admin@blottr.fr',
        isFeatured: true,
        priority: 1,
        averageRating: 4.8,
        totalReviews: 127,
        metaTitle: 'Ink Palace Studio - Tatouage Paris | Réalisme & Traditionnel',
        metaDescription: 'Studio de tatouage parisien spécialisé en réalisme et traditionnel. Équipe expérimentée, matériel stérilisé, créations uniques sur rendez-vous.',
        seoKeywords: ['tattoo', 'tatouage', 'paris', 'réalisme', 'traditionnel', 'rivoli']
      },
      {
        name: 'Black Rose Tattoo',
        slug: 'black-rose-tattoo-paris',
        description: 'Salon spécialisé dans les tatouages féminins, floraux et délicats. Atmosphère cosy et accueillante dans le Marais.',
        shortDescription: 'Tatouages féminins et floraux dans le Marais',
        email: 'hello@blackrosetattoo.fr',
        phone: '+33143298765',
        website: 'https://blackrosetattoo.fr',
        cityId: paris.id,
        address: '23 rue des Rosiers',
        postalCode: '75004',
        latitude: 48.8577,
        longitude: 2.3596,
        openingHours: {
          monday: { isOpen: false },
          tuesday: { isOpen: true, openTime: '11:00', closeTime: '18:00' },
          wednesday: { isOpen: true, openTime: '11:00', closeTime: '18:00' },
          thursday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
          friday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '17:00' },
          sunday: { isOpen: false }
        },
        services: ['Tatouages féminins', 'Motifs floraux', 'Fine line', 'Minimaliste', 'Lettering'],
        priceRangeMin: 80,
        priceRangeMax: 250,
        instagramHandle: '@blackrosetattoo_paris',
        verificationStatus: SalonVerificationStatus.VERIFIED,
        verifiedAt: DateTime.fromISO('2024-02-10'),
        verifiedBy: 'admin@blottr.fr',
        averageRating: 4.6,
        totalReviews: 89
      },

      // Lyon Salons
      {
        name: 'Lyon Tattoo Collective',
        slug: 'lyon-tattoo-collective',
        description: 'Collectif d\'artistes tatoueurs lyonnais réunissant différents styles et spécialités. Créativité et professionnalisme au service de vos projets.',
        shortDescription: 'Collectif d\'artistes lyonnais multi-styles',
        email: 'contact@lyontattoo.fr',
        phone: '+33478456789',
        website: 'https://lyontattoo.fr',
        cityId: lyon.id,
        address: '42 rue de la République',
        postalCode: '69001',
        latitude: 45.7640,
        longitude: 4.8357,
        openingHours: {
          monday: { isOpen: false },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
          sunday: { isOpen: true, openTime: '11:00', closeTime: '17:00' }
        },
        services: ['Traditionnel japonais', 'New School', 'Géométrique', 'Biomécanique', 'Portrait'],
        priceRangeMin: 100,
        priceRangeMax: 350,
        instagramHandle: '@lyontattooCollective',
        verificationStatus: SalonVerificationStatus.VERIFIED,
        verifiedAt: DateTime.fromISO('2024-01-20'),
        verifiedBy: 'admin@blottr.fr',
        isFeatured: true,
        priority: 2,
        averageRating: 4.7,
        totalReviews: 156
      },

      // Marseille Salons
      {
        name: 'Méditerranée Ink',
        slug: 'mediterranee-ink-marseille',
        description: 'Studio marseillais avec vue sur le Vieux-Port. Spécialisé dans les tatouages maritimes, tribaux méditerranéens et styles provençaux.',
        shortDescription: 'Tatouages maritimes et méditerranéens',
        email: 'contact@mediterraneink.fr',
        phone: '+33491234567',
        cityId: marseille.id,
        address: '15 Quai du Port',
        postalCode: '13002',
        latitude: 43.2965,
        longitude: 5.3698,
        openingHours: {
          monday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          sunday: { isOpen: false }
        },
        services: ['Tatouages maritimes', 'Tribal méditerranéen', 'Anchors & nautique', 'Provençal'],
        priceRangeMin: 90,
        priceRangeMax: 280,
        instagramHandle: '@mediterraneink',
        verificationStatus: SalonVerificationStatus.VERIFIED,
        verifiedAt: DateTime.fromISO('2024-02-05'),
        verifiedBy: 'admin@blottr.fr',
        averageRating: 4.5,
        totalReviews: 73
      },

      // Bordeaux Salons
      {
        name: 'Bordeaux Art & Ink',
        slug: 'bordeaux-art-ink',
        description: 'Studio bordelais alliance entre art traditionnel et techniques modernes. Spécialisé dans les œuvres d\'art corporel sur-mesure.',
        shortDescription: 'Art corporel sur-mesure à Bordeaux',
        email: 'studio@bordeauxartink.fr',
        phone: '+33556789123',
        website: 'https://bordeauxartink.fr',
        cityId: bordeaux.id,
        address: '8 cours de l\'Intendance',
        postalCode: '33000',
        latitude: 44.8378,
        longitude: -0.5792,
        openingHours: {
          monday: { isOpen: false },
          tuesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          wednesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          thursday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
          saturday: { isOpen: true, openTime: '09:00', closeTime: '18:00' },
          sunday: { isOpen: false }
        },
        services: ['Art sur-mesure', 'Réalisme coloré', 'Aquarelle', 'Neo-traditional', 'Cover-up artistique'],
        priceRangeMin: 110,
        priceRangeMax: 380,
        instagramHandle: '@bordeauxartink',
        verificationStatus: SalonVerificationStatus.CONTACTED,
        averageRating: 4.4,
        totalReviews: 42
      },

      // Toulouse Salons
      {
        name: 'Pink City Tattoo',
        slug: 'pink-city-tattoo-toulouse',
        description: 'Dans la ville rose, studio moderne spécialisé dans les créations colorées et les designs contemporains. Ambiance rock et conviviale.',
        shortDescription: 'Créations colorées et designs contemporains',
        email: 'info@pinkcitytattoo.fr',
        phone: '+33561234567',
        cityId: toulouse.id,
        address: '12 place du Capitole',
        postalCode: '31000',
        latitude: 43.6047,
        longitude: 1.4442,
        openingHours: {
          monday: { isOpen: false },
          tuesday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
          wednesday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
          thursday: { isOpen: true, openTime: '11:00', closeTime: '19:00' },
          friday: { isOpen: true, openTime: '11:00', closeTime: '20:00' },
          saturday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
          sunday: { isOpen: false }
        },
        services: ['New School coloré', 'Pop Art', 'Cartoon', 'Illustration', 'Typography moderne'],
        priceRangeMin: 85,
        priceRangeMax: 300,
        instagramHandle: '@pinkcitytattoo',
        verificationStatus: SalonVerificationStatus.SCRAPED,
        averageRating: 4.3,
        totalReviews: 67
      }
    ]

    // Create salons
    for (const salonData of salonsData) {
      await Salon.firstOrCreate(
        { slug: salonData.slug },
        salonData
      )
    }

    console.log('✅ Salons seeded successfully')
  }
}
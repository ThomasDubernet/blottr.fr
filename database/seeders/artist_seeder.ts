import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Artist, { ArtistVerificationStatus, ArtistExperienceLevel } from '#models/artist'
import Salon from '#models/salon'
import City from '#models/city'
import User, { UserRole } from '#models/user'

export default class ArtistSeeder extends BaseSeeder {
  async run() {
    // Get cities and salons for artist data
    const paris = await City.findBy('slug', 'paris')
    const lyon = await City.findBy('slug', 'lyon')
    const marseille = await City.findBy('slug', 'marseille')
    const bordeaux = await City.findBy('slug', 'bordeaux')
    const toulouse = await City.findBy('slug', 'toulouse')

    const inkPalace = await Salon.findBy('slug', 'ink-palace-studio-paris')
    const blackRose = await Salon.findBy('slug', 'black-rose-tattoo-paris')
    const lyonCollective = await Salon.findBy('slug', 'lyon-tattoo-collective')
    const mediterranee = await Salon.findBy('slug', 'mediterranee-ink-marseille')
    const bordeauxArt = await Salon.findBy('slug', 'bordeaux-art-ink')
    const pinkCity = await Salon.findBy('slug', 'pink-city-tattoo-toulouse')

    if (!paris || !lyon || !marseille || !bordeaux || !toulouse) {
      console.log('❌ Artists need cities to be seeded first')
      return
    }

    // Create artist users first
    const artistUsersData = [
      {
        fullName: 'Alexandre Moreau',
        email: 'alexandre.moreau@inkpalace.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33142365479',
        cityId: paris.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Céline Dubois',
        email: 'celine.dubois@blackrosetattoo.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33143298766',
        cityId: paris.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Maxime Laurent',
        email: 'maxime.laurent@lyontattoo.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33478456790',
        cityId: lyon.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Sophie Bernard',
        email: 'sophie.bernard@lyontattoo.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33478456791',
        cityId: lyon.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Thomas Martinez',
        email: 'thomas.martinez@mediterraneink.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33491234568',
        cityId: marseille.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Julie Petit',
        email: 'julie.petit@bordeauxartink.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33556789124',
        cityId: bordeaux.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
      {
        fullName: 'Nicolas Garcia',
        email: 'nicolas.garcia@pinkcitytattoo.fr',
        password: 'password123',
        role: UserRole.ARTIST,
        phone: '+33561234568',
        cityId: toulouse.id,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
      },
    ]

    // Create artist users
    const createdUsers = []
    for (const userData of artistUsersData) {
      const user = await User.firstOrCreate({ email: userData.email }, userData)
      createdUsers.push(user)
    }

    // Artist data
    const artistsData = [
      {
        userId: createdUsers[0].id,
        stageName: 'Alex Ink',
        slug: 'alex-ink-paris',
        bio: "Artiste tatoueur parisien spécialisé dans le réalisme et le traditionnel. Plus de 12 ans d'expérience, formé aux techniques japonaises traditionnelles. Passion pour les portraits et les créations personnalisées.",
        shortBio: "Expert réalisme et traditionnel, 12 ans d'expérience",
        specialty: 'Réalisme, portraits, traditionnel japonais',
        yearsExperience: 12,
        startedTattooingAt: DateTime.now().minus({ years: 12 }),
        experienceLevel: ArtistExperienceLevel.EXPERT,
        artStyles: ['réalisme', 'traditionnel', 'japonais', 'portrait', 'noir-et-blanc'],
        cityId: paris.id,
        primarySalonId: inkPalace?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 150,
        maxPrice: 450,
        portfolioImages: [
          'https://images.unsplash.com/photo-1565058379802-bbe93b2e6eb3?w=800',
          'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800',
          'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800',
        ],
        instagramHandle: '@alex_ink_paris',
        instagramUrl: 'https://instagram.com/alex_ink_paris',
        website: 'https://alexink.fr',
        verificationStatus: ArtistVerificationStatus.VERIFIED,
        verifiedAt: DateTime.now().minus({ days: 30 }),
        verifiedBy: 'admin@blottr.fr',
        hasHealthCertificate: true,
        hasProfessionalInsurance: true,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 2 }),
        isFeatured: true,
        priority: 1,
        averageRating: 4.9,
        totalReviews: 89,
        totalTattoos: 340,
        profileViews: 1250,
        availability: {
          monday: { isAvailable: false },
          tuesday: { isAvailable: true, startTime: '10:00', endTime: '18:00' },
          wednesday: { isAvailable: true, startTime: '10:00', endTime: '18:00' },
          thursday: { isAvailable: true, startTime: '10:00', endTime: '18:00' },
          friday: { isAvailable: true, startTime: '10:00', endTime: '19:00' },
          saturday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
          sunday: { isAvailable: false },
        },
        metaTitle: 'Alex Ink - Artiste Tatoueur Paris | Réalisme & Traditionnel',
        metaDescription:
          "Expert en tatouage réaliste et traditionnel à Paris. 12 ans d'expérience, spécialisé dans les portraits et créations japonaises.",
        seoKeywords: ['alex ink', 'tatoueur paris', 'réalisme', 'traditionnel', 'portrait tattoo'],
      },
      {
        userId: createdUsers[1].id,
        stageName: 'Céline Rose',
        slug: 'celine-rose-paris',
        bio: 'Artiste spécialisée dans les tatouages féminins, floraux et délicats. Approche douce et personnalisée, expertise dans les fine lines et designs minimalistes.',
        shortBio: 'Spécialiste tatouages féminins et floraux',
        specialty: 'Fine line, floral, minimaliste, féminin',
        yearsExperience: 8,
        startedTattooingAt: DateTime.now().minus({ years: 8 }),
        experienceLevel: ArtistExperienceLevel.ADVANCED,
        artStyles: ['fine-line', 'floral', 'minimaliste', 'aquarelle', 'féminin'],
        cityId: paris.id,
        primarySalonId: blackRose?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 100,
        maxPrice: 280,
        portfolioImages: ['https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800'],
        instagramHandle: '@celine_rose_tattoo',
        instagramUrl: 'https://instagram.com/celine_rose_tattoo',
        verificationStatus: ArtistVerificationStatus.VERIFIED,
        verifiedAt: DateTime.now().minus({ days: 20 }),
        verifiedBy: 'admin@blottr.fr',
        hasHealthCertificate: true,
        hasProfessionalInsurance: true,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 1 }),
        isFeatured: true,
        priority: 2,
        averageRating: 4.7,
        totalReviews: 67,
        totalTattoos: 210,
        profileViews: 890,
      },
      {
        userId: createdUsers[2].id,
        stageName: 'Max Lyon',
        slug: 'max-lyon',
        bio: 'Artiste polyvalent du collectif lyonnais, spécialisé dans le traditionnel japonais et les créations géométriques modernes. Passionné par la fusion des styles anciens et contemporains.',
        shortBio: 'Traditionnel japonais et géométrique moderne',
        specialty: 'Traditionnel japonais, géométrique, biomécanique',
        yearsExperience: 10,
        startedTattooingAt: DateTime.now().minus({ years: 10 }),
        experienceLevel: ArtistExperienceLevel.EXPERT,
        artStyles: ['traditionnel-japonais', 'géométrique', 'biomécanique', 'new-school'],
        cityId: lyon.id,
        primarySalonId: lyonCollective?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 120,
        maxPrice: 380,
        instagramHandle: '@max_lyon_tattoo',
        verificationStatus: ArtistVerificationStatus.VERIFIED,
        verifiedAt: DateTime.now().minus({ days: 45 }),
        verifiedBy: 'admin@blottr.fr',
        hasHealthCertificate: true,
        hasProfessionalInsurance: true,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 2 }),
        averageRating: 4.6,
        totalReviews: 52,
        totalTattoos: 185,
        profileViews: 650,
      },
      {
        userId: createdUsers[3].id,
        stageName: 'Sophie Art',
        slug: 'sophie-art-lyon',
        bio: "Artiste lyonnaise spécialisée dans les portraits réalistes et l'art néo-traditionnel. Formée aux beaux-arts, j'apporte une approche artistique unique à chaque création.",
        shortBio: 'Portraits réalistes et néo-traditionnel',
        specialty: 'Portrait, néo-traditionnel, art figuratif',
        yearsExperience: 6,
        startedTattooingAt: DateTime.now().minus({ years: 6 }),
        experienceLevel: ArtistExperienceLevel.ADVANCED,
        artStyles: ['portrait', 'néo-traditionnel', 'réalisme-coloré', 'art-figuratif'],
        cityId: lyon.id,
        primarySalonId: lyonCollective?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 110,
        maxPrice: 320,
        instagramHandle: '@sophie_art_tattoo',
        verificationStatus: ArtistVerificationStatus.VERIFIED,
        verifiedAt: DateTime.now().minus({ days: 15 }),
        verifiedBy: 'admin@blottr.fr',
        hasHealthCertificate: true,
        hasProfessionalInsurance: true,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 1 }),
        averageRating: 4.5,
        totalReviews: 38,
        totalTattoos: 125,
        profileViews: 420,
      },
      {
        userId: createdUsers[4].id,
        stageName: 'Thomas Mer',
        slug: 'thomas-mer-marseille',
        bio: 'Artiste marseillais inspiré par la Méditerranée. Spécialisé dans les tatouages maritimes, tribaux méditerranéens et les créations inspirées de la culture provençale.',
        shortBio: 'Spécialiste maritime et méditerranéen',
        specialty: 'Maritime, tribal méditerranéen, provençal',
        yearsExperience: 9,
        startedTattooingAt: DateTime.now().minus({ years: 9 }),
        experienceLevel: ArtistExperienceLevel.ADVANCED,
        artStyles: ['maritime', 'tribal', 'provençal', 'nautique', 'méditerranéen'],
        cityId: marseille.id,
        primarySalonId: mediterranee?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 95,
        maxPrice: 290,
        instagramHandle: '@thomas_mer_tattoo',
        verificationStatus: ArtistVerificationStatus.VERIFIED,
        verifiedAt: DateTime.now().minus({ days: 25 }),
        verifiedBy: 'admin@blottr.fr',
        hasHealthCertificate: true,
        hasProfessionalInsurance: true,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 1, months: 6 }),
        averageRating: 4.4,
        totalReviews: 31,
        totalTattoos: 95,
        profileViews: 315,
      },
      {
        userId: createdUsers[5].id,
        stageName: 'Julie Bordeaux',
        slug: 'julie-bordeaux',
        bio: "Artiste bordelaise spécialisée dans l'art sur-mesure et les créations aquarelle. Approche artistique unique mêlant techniques traditionnelles et innovations contemporaines.",
        shortBio: 'Art sur-mesure et aquarelle',
        specialty: 'Aquarelle, art sur-mesure, néo-traditionnel',
        yearsExperience: 7,
        startedTattooingAt: DateTime.now().minus({ years: 7 }),
        experienceLevel: ArtistExperienceLevel.ADVANCED,
        artStyles: ['aquarelle', 'néo-traditionnel', 'sur-mesure', 'cover-up'],
        cityId: bordeaux.id,
        primarySalonId: bordeauxArt?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 130,
        maxPrice: 400,
        instagramHandle: '@julie_bordeaux_art',
        verificationStatus: ArtistVerificationStatus.CONTACTED,
        hasHealthCertificate: true,
        hasProfessionalInsurance: false,
        healthCertificateExpiresAt: DateTime.now().plus({ years: 1 }),
        averageRating: 4.2,
        totalReviews: 19,
        totalTattoos: 68,
        profileViews: 180,
      },
      {
        userId: createdUsers[6].id,
        stageName: 'Nico Pink',
        slug: 'nico-pink-toulouse',
        bio: 'Artiste toulousain spécialisé dans les créations colorées, le new school et les designs pop art. Ambiance décontractée pour des tatouages qui claquent !',
        shortBio: 'New school coloré et pop art',
        specialty: 'New school, pop art, cartoon, illustration',
        yearsExperience: 5,
        startedTattooingAt: DateTime.now().minus({ years: 5 }),
        experienceLevel: ArtistExperienceLevel.INTERMEDIATE,
        artStyles: ['new-school', 'pop-art', 'cartoon', 'illustration', 'coloré'],
        cityId: toulouse.id,
        primarySalonId: pinkCity?.id,
        acceptsBookings: true,
        appointmentOnly: true,
        minPrice: 90,
        maxPrice: 320,
        instagramHandle: '@nico_pink_tattoo',
        verificationStatus: ArtistVerificationStatus.SCRAPED,
        hasHealthCertificate: false,
        hasProfessionalInsurance: true,
        averageRating: 4.1,
        totalReviews: 25,
        totalTattoos: 78,
        profileViews: 245,
      },
    ]

    // Create artists
    const createdArtists = []
    for (const artistData of artistsData) {
      const artist = await Artist.firstOrCreate({ slug: artistData.slug }, artistData)
      createdArtists.push(artist)
    }

    // Create artist-salon relationships
    const relationships = [
      { artistIndex: 0, salonId: inkPalace?.id, type: 'primary' },
      { artistIndex: 1, salonId: blackRose?.id, type: 'primary' },
      { artistIndex: 2, salonId: lyonCollective?.id, type: 'primary' },
      { artistIndex: 3, salonId: lyonCollective?.id, type: 'primary' },
      { artistIndex: 4, salonId: mediterranee?.id, type: 'primary' },
      { artistIndex: 5, salonId: bordeauxArt?.id, type: 'primary' },
      { artistIndex: 6, salonId: pinkCity?.id, type: 'primary' },
      // Guest relationships
      { artistIndex: 0, salonId: blackRose?.id, type: 'guest' },
      { artistIndex: 1, salonId: inkPalace?.id, type: 'guest' },
    ]

    for (const rel of relationships) {
      const artist = createdArtists[rel.artistIndex]
      if (rel.salonId && artist) {
        try {
          await artist.addToSalon(rel.salonId, rel.type as any)
        } catch (error) {
          // Relationship might already exist, skip
        }
      }
    }

    // Update salon artist counts
    for (const salon of [
      inkPalace,
      blackRose,
      lyonCollective,
      mediterranee,
      bordeauxArt,
      pinkCity,
    ]) {
      if (salon) {
        await salon.updateArtistCount()
      }
    }

    console.log('✅ Artists and relationships seeded successfully')
  }
}

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Artist from '#models/artist'
import City from '#models/city'
import Salon from '#models/salon'

export default class extends BaseSeeder {
  async run() {
    // Check if artists already exist
    const existingCount = await Artist.query().count('* as total')
    if (existingCount[0].$extras.total > 0) {
      return
    }

    // Get cities and salons for relationships
    const cities = await City.all()
    const salons = await Salon.all()

    const paris = cities.find((city) => city.name === 'Paris')
    const lyon = cities.find((city) => city.name === 'Lyon')
    const marseille = cities.find((city) => city.name === 'Marseille')
    const bordeaux = cities.find((city) => city.name === 'Bordeaux')

    const inkMasters = salons.find((salon) => salon.slug === 'ink-masters-paris')
    const blackRose = salons.find((salon) => salon.slug === 'black-rose-tattoo-lyon')
    const electricOctopus = salons.find((salon) => salon.slug === 'electric-octopus-marseille')
    const minimalInk = salons.find((salon) => salon.slug === 'minimal-ink-studio-paris')

    const artists = [
      // Verified artists with complete profiles
      {
        firstname: 'Alexandre',
        lastname: 'Moreau',
        email: 'alex.moreau@inkmastersaris.fr',
        phone: '+33 6 78 90 12 34',
        bio: "Artiste tatoueur spécialisé dans le réalisme noir et blanc depuis plus de 12 ans. Passionné par les portraits et les créations sur-mesure. Formé à l'international.",
        avatar: '/images/artists/alexandre-moreau.jpg',
        isGuest: false,
        salonId: inkMasters?.id || null,
        isVerified: true,
        verificationStatus: 'verified',
        instagramHandle: 'alex_moreau_tattoo',
        instagramUrl: 'https://instagram.com/alex_moreau_tattoo',
        instagramFollowers: 28500,
        dataSource: 'manual_registration',
        slug: 'alexandre-moreau-paris',
        seoTitle: 'Alexandre Moreau - Tatoueur réalisme Paris',
        seoDescription:
          "Artiste tatoueur spécialisé en réalisme noir et blanc à Paris. 12 ans d'expérience, portraits et créations sur-mesure.",
        isClaimed: true,
        editorPick: true,
        cityId: paris?.id || null,
        viewCount: 2145,
        favoriteCount: 89,
        contactCount: 156,
        gptBio:
          "Maître du réalisme en noir et blanc, Alexandre transforme vos idées en œuvres d'art corporelles saisissantes.",
        gptStyles: {
          primary: ['realism', 'portrait'],
          secondary: ['blackwork'],
          expertise: 'advanced',
        },
        gptAnalyzed: true,
      },
      {
        firstname: 'Sarah',
        lastname: 'Chen',
        email: 'sarah.chen@blackrosetattoo.fr',
        phone: '+33 6 89 01 23 45',
        bio: 'Artiste franco-asiatique spécialisée dans le style néo-traditionnel avec des influences japonaises. Créatrice de designs floraux uniques.',
        avatar: '/images/artists/sarah-chen.jpg',
        isGuest: false,
        salonId: blackRose?.id || null,
        isVerified: true,
        verificationStatus: 'verified',
        instagramHandle: 'sarahchen_tattoo',
        instagramUrl: 'https://instagram.com/sarahchen_tattoo',
        instagramFollowers: 15200,
        dataSource: 'manual_registration',
        slug: 'sarah-chen-lyon',
        seoTitle: 'Sarah Chen - Tatouage néo-traditionnel Lyon',
        seoDescription:
          'Artiste spécialisée en néo-traditionnel et influences japonaises à Lyon. Créations florales uniques et personnalisées.',
        isClaimed: true,
        editorPick: true,
        cityId: lyon?.id || null,
        viewCount: 1876,
        favoriteCount: 67,
        contactCount: 94,
        gptBio:
          'Fusion parfaite entre tradition japonaise et modernité, Sarah crée des jardins floraux sur peau.',
        gptStyles: {
          primary: ['neo-traditional', 'japanese'],
          secondary: ['floral'],
          expertise: 'expert',
        },
        gptAnalyzed: true,
      },
      {
        firstname: 'Marco',
        lastname: 'Dubois',
        email: 'marco@electricoctopus.fr',
        phone: '+33 6 12 34 56 78',
        bio: 'Créateur de tatouages géométriques et abstraits. Approche artistique contemporaine mêlant mathématiques et esthétique.',
        avatar: '/images/artists/marco-dubois.jpg',
        isGuest: false,
        salonId: electricOctopus?.id || null,
        isVerified: true,
        verificationStatus: 'verified',
        instagramHandle: 'marco_geometric_ink',
        instagramUrl: 'https://instagram.com/marco_geometric_ink',
        instagramFollowers: 19800,
        dataSource: 'manual_registration',
        slug: 'marco-dubois-marseille',
        seoTitle: 'Marco Dubois - Tatouage géométrique Marseille',
        seoDescription:
          'Artiste spécialisé en tatouages géométriques et abstraits à Marseille. Approche contemporaine et créations uniques.',
        isClaimed: true,
        editorPick: false,
        cityId: marseille?.id || null,
        viewCount: 1234,
        favoriteCount: 45,
        contactCount: 78,
        gptBio:
          "Architecte de l'encre, Marco transforme les formules mathématiques en art corporel géométrique.",
        gptStyles: {
          primary: ['geometric', 'abstract'],
          secondary: ['minimalist'],
          expertise: 'advanced',
        },
        gptAnalyzed: true,
      },
      {
        firstname: 'Emma',
        lastname: 'Laurent',
        email: 'emma@minimalink.fr',
        phone: '+33 6 23 45 67 89',
        bio: 'Spécialiste du tatouage minimaliste et fine line. Délicatesse et précision pour des créations subtiles et élégantes.',
        avatar: '/images/artists/emma-laurent.jpg',
        isGuest: false,
        salonId: minimalInk?.id || null,
        isVerified: true,
        verificationStatus: 'verified',
        instagramHandle: 'emma_fineline',
        instagramUrl: 'https://instagram.com/emma_fineline',
        instagramFollowers: 22100,
        dataSource: 'manual_registration',
        slug: 'emma-laurent-paris-minimalist',
        seoTitle: 'Emma Laurent - Tatouage minimaliste Paris',
        seoDescription:
          'Spécialiste du tatouage minimaliste et fine line à Paris. Créations délicates et élégantes.',
        isClaimed: true,
        editorPick: true,
        cityId: paris?.id || null,
        viewCount: 3210,
        favoriteCount: 123,
        contactCount: 187,
        gptBio:
          'Maîtresse du trait fin, Emma sublime la peau avec des créations minimalistes pleines de poésie.',
        gptStyles: {
          primary: ['minimalist', 'fine-line'],
          secondary: ['botanical'],
          expertise: 'expert',
        },
        gptAnalyzed: true,
      },

      // Instagram scraped artists (in various onboarding stages)
      {
        firstname: 'Julien',
        lastname: 'Blackwork',
        email: null,
        phone: null,
        bio: null,
        avatar: null,
        isGuest: false,
        salonId: null,
        isVerified: false,
        verificationStatus: 'scraped',
        instagramHandle: 'julien_blackwork_ink',
        instagramUrl: 'https://instagram.com/julien_blackwork_ink',
        instagramFollowers: 8900,
        dataSource: 'instagram_scraping',
        slug: 'julien-blackwork-bordeaux',
        seoTitle: null,
        seoDescription: null,
        isClaimed: false,
        editorPick: false,
        cityId: bordeaux?.id || null,
        viewCount: 234,
        favoriteCount: 12,
        contactCount: 3,
        gptBio: 'Artiste émergent spécialisé dans le blackwork et les motifs tribaux modernes.',
        gptStyles: {
          primary: ['blackwork', 'tribal'],
          secondary: [],
          expertise: 'intermediate',
        },
        gptAnalyzed: true,
        verificationToken: 'tok_julien_blackwork_2023',
      },
      {
        firstname: 'Léa',
        lastname: 'Watercolor',
        email: 'lea.watercolor.pro@gmail.com',
        phone: null,
        bio: 'Artiste tatoueur aquarelle en cours de vérification. Portfolio coloré et créatif disponible sur Instagram.',
        avatar: null,
        isGuest: true,
        salonId: null,
        isVerified: false,
        verificationStatus: 'contacted',
        instagramHandle: 'lea_watercolor_art',
        instagramUrl: 'https://instagram.com/lea_watercolor_art',
        instagramFollowers: 12400,
        dataSource: 'instagram_scraping',
        slug: 'lea-watercolor-lyon',
        seoTitle: null,
        seoDescription: null,
        isClaimed: false,
        editorPick: false,
        cityId: lyon?.id || null,
        viewCount: 567,
        favoriteCount: 23,
        contactCount: 8,
        gptBio: "Peintre de la peau, Léa apporte la magie de l'aquarelle au monde du tatouage.",
        gptStyles: {
          primary: ['watercolor', 'abstract'],
          secondary: ['floral'],
          expertise: 'intermediate',
        },
        gptAnalyzed: true,
        verificationToken: 'tok_lea_watercolor_2023',
      },
      {
        firstname: 'Thomas',
        lastname: 'Traditional',
        email: 'thomas.trad.tattoo@outlook.fr',
        phone: '+33 6 45 67 89 01',
        bio: "En cours d'inscription sur la plateforme. Tatoueur traditionnel avec 8 ans d'expérience.",
        avatar: '/images/artists/thomas-traditional.jpg',
        isGuest: false,
        salonId: null, // Independent artist
        isVerified: false,
        verificationStatus: 'onboarding',
        instagramHandle: 'thomas_traditional_ink',
        instagramUrl: 'https://instagram.com/thomas_traditional_ink',
        instagramFollowers: 6700,
        dataSource: 'instagram_scraping',
        slug: 'thomas-traditional-marseille',
        seoTitle: null,
        seoDescription: null,
        isClaimed: true,
        editorPick: false,
        cityId: marseille?.id || null,
        viewCount: 123,
        favoriteCount: 5,
        contactCount: 15,
        gptBio:
          "Gardien des traditions, Thomas perpétue l'art du tatouage old school avec authenticité.",
        gptStyles: {
          primary: ['traditional', 'old-school'],
          secondary: ['american-traditional'],
          expertise: 'advanced',
        },
        gptAnalyzed: true,
        verificationToken: 'tok_thomas_traditional_2023',
      },

      // Independent artist (no salon)
      {
        firstname: 'Nina',
        lastname: 'Rodriguez',
        email: 'nina.rodriguez.tattoo@proton.me',
        phone: '+33 6 67 89 01 23',
        bio: 'Artiste tatoueur indépendante spécialisée dans le style chicano et les portraits réalistes. Studio privé sur rendez-vous uniquement.',
        avatar: '/images/artists/nina-rodriguez.jpg',
        isGuest: false,
        salonId: null, // Independent
        isVerified: true,
        verificationStatus: 'verified',
        instagramHandle: 'nina_chicano_ink',
        instagramUrl: 'https://instagram.com/nina_chicano_ink',
        instagramFollowers: 13600,
        dataSource: 'manual_registration',
        slug: 'nina-rodriguez-paris-independent',
        seoTitle: 'Nina Rodriguez - Tatoueur indépendante Paris',
        seoDescription:
          'Artiste tatoueur indépendante à Paris, spécialisée en style chicano et portraits réalistes. Studio privé.',
        isClaimed: true,
        editorPick: false,
        cityId: paris?.id || null,
        viewCount: 1567,
        favoriteCount: 78,
        contactCount: 92,
        gptBio:
          "Indépendante et passionnée, Nina capture l'âme chicana dans chaque trait de ses créations.",
        gptStyles: {
          primary: ['chicano', 'realism'],
          secondary: ['portrait'],
          expertise: 'expert',
        },
        gptAnalyzed: true,
      },
    ]

    await Artist.createMany(artists)
    console.log('✅ Artists seeded successfully')
  }
}

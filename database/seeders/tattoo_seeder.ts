import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tattoo from '#models/tattoo'
import Artist from '#models/artist'
import Tag from '#models/tag'
import { TattooStatus, TattooStyle, BodyPlacement, SizeCategory, ColorType } from '#models/tattoo'

export default class extends BaseSeeder {
  async run() {
    // Get some artists to associate with tattoos
    const artists = await Artist.query().limit(5)
    if (artists.length === 0) {
      console.log('No artists found. Please run artist seeder first.')
      return
    }

    // Get some tags for association
    const styleTags = await Tag.query().where('category', 'style').limit(5)
    const subjectTags = await Tag.query().where('category', 'subject').limit(3)
    const bodyPartTags = await Tag.query().where('category', 'body_part').limit(4)

    const sampleTattoos = [
      {
        artistId: artists[0].id,
        title: 'Dragon Sleeve Traditional',
        description: 'Full sleeve traditional dragon tattoo with vibrant colors and bold lines',
        slug: 'dragon-sleeve-traditional-001',
        originalFilename: 'dragon_sleeve_001.jpg',
        storagePath: '/uploads/tattoos/2024/01/dragon_sleeve_001.jpg',
        imageVariants: {
          thumbnail: '/uploads/tattoos/2024/01/dragon_sleeve_001_thumb.jpg',
          medium: '/uploads/tattoos/2024/01/dragon_sleeve_001_medium.jpg',
          large: '/uploads/tattoos/2024/01/dragon_sleeve_001_large.jpg',
          original: '/uploads/tattoos/2024/01/dragon_sleeve_001.jpg',
        },
        primaryColor: '#FF6B35',
        fileSize: 2456789,
        dimensions: {
          width: 1920,
          height: 2880,
          aspectRatio: 0.67,
        },
        contentType: 'image/jpeg',
        tattooStyle: TattooStyle.TRADITIONAL,
        bodyPlacement: BodyPlacement.ARM,
        sizeCategory: SizeCategory.LARGE,
        colorType: ColorType.COLOR,
        sessionCount: 4,
        estimatedHours: 12.0,
        status: TattooStatus.PUBLISHED,
        isFeatured: true,
        isPortfolioHighlight: true,
        viewCount: 1250,
        likeCount: 89,
        shareCount: 23,
        allowsInquiries: true,
        showsPricing: true,
        priceEstimate: 1800.0,
        priceCurrency: 'EUR',
        altText: {
          fr: 'Tatouage dragon traditionnel sur bras complet avec couleurs vives',
          en: 'Traditional dragon tattoo full arm sleeve with vibrant colors',
        },
        searchKeywords: ['dragon', 'traditional', 'sleeve', 'arm', 'colorful'],
        metaTitle: 'Dragon Sleeve Traditional Tattoo | Blottr Portfolio',
        metaDescription:
          'Stunning traditional dragon sleeve tattoo featuring vibrant colors and expert linework',
        publishedAt: new Date('2024-01-15T10:00:00Z'),
      },
      {
        artistId: artists[1].id,
        title: 'Realistic Rose Portrait',
        description: 'Photorealistic black and grey rose with intricate details and shading',
        slug: 'realistic-rose-portrait-002',
        originalFilename: 'realistic_rose_002.jpg',
        storagePath: '/uploads/tattoos/2024/01/realistic_rose_002.jpg',
        imageVariants: {
          thumbnail: '/uploads/tattoos/2024/01/realistic_rose_002_thumb.jpg',
          medium: '/uploads/tattoos/2024/01/realistic_rose_002_medium.jpg',
          large: '/uploads/tattoos/2024/01/realistic_rose_002_large.jpg',
          original: '/uploads/tattoos/2024/01/realistic_rose_002.jpg',
        },
        primaryColor: '#666666',
        fileSize: 1845623,
        dimensions: {
          width: 1440,
          height: 1920,
          aspectRatio: 0.75,
        },
        contentType: 'image/jpeg',
        tattooStyle: TattooStyle.REALISTIC,
        bodyPlacement: BodyPlacement.SHOULDER,
        sizeCategory: SizeCategory.MEDIUM,
        colorType: ColorType.BLACK_AND_GREY,
        sessionCount: 2,
        estimatedHours: 6.0,
        status: TattooStatus.PUBLISHED,
        isFeatured: true,
        isPortfolioHighlight: false,
        viewCount: 892,
        likeCount: 67,
        shareCount: 12,
        allowsInquiries: true,
        showsPricing: true,
        priceEstimate: 650.0,
        priceCurrency: 'EUR',
        altText: {
          fr: 'Tatouage rose réaliste en noir et gris sur épaule',
          en: 'Realistic black and grey rose tattoo on shoulder',
        },
        searchKeywords: ['rose', 'realistic', 'black and grey', 'shoulder', 'flower'],
        metaTitle: 'Realistic Rose Tattoo | Professional Portfolio',
        metaDescription:
          'Beautiful realistic rose tattoo in black and grey with stunning detail work',
        publishedAt: new Date('2024-01-20T14:30:00Z'),
      },
      {
        artistId: artists[2].id,
        title: 'Minimalist Geometric Triangle',
        description: 'Clean geometric triangle design with fine lines',
        slug: 'minimalist-geometric-triangle-003',
        originalFilename: 'geometric_triangle_003.jpg',
        storagePath: '/uploads/tattoos/2024/01/geometric_triangle_003.jpg',
        imageVariants: {
          thumbnail: '/uploads/tattoos/2024/01/geometric_triangle_003_thumb.jpg',
          medium: '/uploads/tattoos/2024/01/geometric_triangle_003_medium.jpg',
          large: '/uploads/tattoos/2024/01/geometric_triangle_003_large.jpg',
          original: '/uploads/tattoos/2024/01/geometric_triangle_003.jpg',
        },
        primaryColor: '#000000',
        fileSize: 845231,
        dimensions: {
          width: 1080,
          height: 1350,
          aspectRatio: 0.8,
        },
        contentType: 'image/jpeg',
        tattooStyle: TattooStyle.GEOMETRIC,
        bodyPlacement: BodyPlacement.FOREARM,
        sizeCategory: SizeCategory.SMALL,
        colorType: ColorType.BLACK_AND_GREY,
        sessionCount: 1,
        estimatedHours: 2.0,
        status: TattooStatus.PUBLISHED,
        isFeatured: false,
        isPortfolioHighlight: false,
        viewCount: 456,
        likeCount: 34,
        shareCount: 8,
        allowsInquiries: true,
        showsPricing: true,
        priceEstimate: 180.0,
        priceCurrency: 'EUR',
        altText: {
          fr: 'Tatouage triangle géométrique minimaliste sur avant-bras',
          en: 'Minimalist geometric triangle tattoo on forearm',
        },
        searchKeywords: ['geometric', 'triangle', 'minimalist', 'forearm', 'linework'],
        metaTitle: 'Geometric Triangle Tattoo | Minimalist Design',
        metaDescription: 'Clean and precise geometric triangle tattoo with minimalist aesthetic',
        publishedAt: new Date('2024-01-25T16:45:00Z'),
      },
    ]

    // Create the tattoos
    const createdTattoos = []
    for (const tattooData of sampleTattoos) {
      const tattoo = await Tattoo.create(tattooData)
      createdTattoos.push(tattoo)
    }

    // Associate tags with tattoos
    if (styleTags.length > 0 && subjectTags.length > 0 && bodyPartTags.length > 0) {
      // Tattoo 1: Dragon Traditional
      await createdTattoos[0].related('tags').attach({
        [styleTags[0].id]: {
          // Traditional
          relevance_score: 1.0,
          is_primary: true,
          assignment_type: 'manual',
          is_approved: true,
        },
        [subjectTags.find((t) => t.slug === 'dragons')?.id || subjectTags[0].id]: {
          // Dragons
          relevance_score: 0.95,
          is_primary: false,
          assignment_type: 'manual',
          is_approved: true,
        },
        [bodyPartTags.find((t) => t.slug === 'arm')?.id || bodyPartTags[0].id]: {
          // Arm
          relevance_score: 0.9,
          is_primary: false,
          assignment_type: 'manual',
          is_approved: true,
        },
      })

      // Tattoo 2: Rose Realistic
      await createdTattoos[1].related('tags').attach({
        [styleTags.find((t) => t.slug === 'realistic')?.id || styleTags[1].id]: {
          // Realistic
          relevance_score: 1.0,
          is_primary: true,
          assignment_type: 'manual',
          is_approved: true,
        },
        [subjectTags.find((t) => t.slug === 'flowers')?.id || subjectTags[1].id]: {
          // Flowers
          relevance_score: 0.95,
          is_primary: false,
          assignment_type: 'manual',
          is_approved: true,
        },
      })

      // Tattoo 3: Geometric Triangle
      await createdTattoos[2].related('tags').attach({
        [styleTags.find((t) => t.slug === 'geometric')?.id || styleTags[2].id]: {
          // Geometric
          relevance_score: 1.0,
          is_primary: true,
          assignment_type: 'manual',
          is_approved: true,
        },
      })

      // Update engagement scores
      for (const tattoo of createdTattoos) {
        await tattoo.updateEngagement()
      }

      // Update tag usage counts
      const usedTags = await Tag.query().whereHas('tattoos', (query) => {
        query.whereIn(
          'tattoo_id',
          createdTattoos.map((t) => t.id)
        )
      })

      for (const tag of usedTags) {
        await tag.incrementUsage()
      }
    }

    console.log(`Created ${createdTattoos.length} sample tattoos with tag associations`)
  }
}

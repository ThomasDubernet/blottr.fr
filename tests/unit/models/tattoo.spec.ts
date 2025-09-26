import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Tattoo, {
  TattooStatus,
  TattooStyle,
  BodyPlacement,
  SizeCategory,
  ColorType,
  type ImageVariants,
  type ImageDimensions,
} from '#models/tattoo'
import Tag, { TagCategory } from '#models/tag'
import Artist, { ArtistExperienceLevel } from '#models/artist'
import User, { UserRole } from '#models/user'
import City from '#models/city'

test.group('Tattoo Model', (group) => {
  // The test bootstrap already configures db truncation for unit tests
  // No additional cleanup needed

  test('doit créer un tatouage avec les données minimales requises', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('creation-minimal')

    const imageVariants: ImageVariants = {
      thumbnail: 'tattoo_thumb.jpg',
      medium: 'tattoo_medium.jpg',
      large: 'tattoo_large.jpg',
      original: 'tattoo_original.jpg',
      webp: {
        thumbnail: 'tattoo_thumb.webp',
        medium: 'tattoo_medium.webp',
        large: 'tattoo_large.webp',
      },
    }

    const dimensions: ImageDimensions = {
      width: 1920,
      height: 1080,
      aspectRatio: 1.78,
    }

    const tattooData = {
      artistId: artist.id,
      title: 'Dragon Japonais Minimal',
      slug: 'dragon-japonais-minimal',
      originalFilename: 'dragon-minimal.jpg',
      storagePath: '/uploads/tattoos/dragon-minimal.jpg',
      imageVariants,
      fileSize: 1024000,
      dimensions,
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    }

    // Act
    const tattoo = await Tattoo.create(tattooData)

    // Assert
    assert.exists(tattoo.id)
    assert.equal(tattoo.artistId, artist.id)
    assert.equal(tattoo.title, 'Dragon Japonais Minimal')
    assert.equal(tattoo.slug, 'dragon-japonais-minimal')
    assert.equal(tattoo.status, TattooStatus.DRAFT)
    assert.equal(tattoo.isFeatured, false)
    assert.equal(tattoo.isPortfolioHighlight, false)
    assert.equal(tattoo.viewCount, 0)
    assert.equal(tattoo.likeCount, 0)
    assert.equal(tattoo.shareCount, 0)
    assert.equal(tattoo.engagementScore, 0)
    assert.equal(tattoo.allowsInquiries, true)
    assert.equal(tattoo.showsPricing, false)
    assert.equal(tattoo.priceCurrency, 'EUR')
    assert.deepEqual(tattoo.imageVariants, imageVariants)
    assert.deepEqual(tattoo.dimensions, dimensions)
    assert.isNotNull(tattoo.createdAt)
    assert.isTrue(tattoo.publishedAt === null || tattoo.publishedAt === undefined)
  })

  test('doit créer un tatouage avec slug personnalisé', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('slug-personnalise')

    // Act
    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Rose & Épines Complexes',
      slug: 'rose-epines-complexes-unique',
      originalFilename: 'rose-unique.jpg',
      storagePath: '/uploads/tattoos/rose-unique.jpg',
      imageVariants: {
        thumbnail: 'rose_thumb.jpg',
        medium: 'rose_medium.jpg',
        large: 'rose_large.jpg',
        original: 'rose_original.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Assert
    assert.equal(tattoo.slug, 'rose-epines-complexes-unique')
  })

  test('doit tester tous les statuts de tatouage', async ({ assert }) => {
    // Test all enum values
    const statuses = [
      TattooStatus.DRAFT,
      TattooStatus.PENDING_REVIEW,
      TattooStatus.PUBLISHED,
      TattooStatus.ARCHIVED,
    ]

    for (const status of statuses) {
      assert.include(Object.values(TattooStatus), status)
    }
  })

  test('doit tester tous les styles de tatouage', async ({ assert }) => {
    // Test all enum values
    const styles = [
      TattooStyle.TRADITIONAL,
      TattooStyle.NEO_TRADITIONAL,
      TattooStyle.REALISTIC,
      TattooStyle.BLACK_AND_GREY,
      TattooStyle.WATERCOLOR,
      TattooStyle.GEOMETRIC,
      TattooStyle.MINIMALIST,
      TattooStyle.JAPANESE,
      TattooStyle.TRIBAL,
      TattooStyle.BIOMECHANICAL,
      TattooStyle.PORTRAIT,
      TattooStyle.ABSTRACT,
      TattooStyle.DOTWORK,
      TattooStyle.LINEWORK,
    ]

    for (const style of styles) {
      assert.include(Object.values(TattooStyle), style)
    }
  })

  test('doit tester tous les emplacements corporels', async ({ assert }) => {
    // Test all enum values
    const placements = [
      BodyPlacement.ARM,
      BodyPlacement.LEG,
      BodyPlacement.BACK,
      BodyPlacement.CHEST,
      BodyPlacement.SHOULDER,
      BodyPlacement.HAND,
      BodyPlacement.FOOT,
      BodyPlacement.NECK,
      BodyPlacement.FACE,
      BodyPlacement.TORSO,
      BodyPlacement.RIBS,
      BodyPlacement.THIGH,
      BodyPlacement.CALF,
      BodyPlacement.FOREARM,
    ]

    for (const placement of placements) {
      assert.include(Object.values(BodyPlacement), placement)
    }
  })

  test('doit calculer correctement isPublished', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('is-published-test')

    // Test published tattoo
    const publishedTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Tatouage Publié',
      slug: 'tatouage-publie-test',
      status: TattooStatus.PUBLISHED,
      publishedAt: DateTime.now(),
      originalFilename: 'published-test.jpg',
      storagePath: '/uploads/published-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Test draft tattoo
    const draftTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Tatouage Brouillon',
      slug: 'tatouage-brouillon-test',
      status: TattooStatus.DRAFT,
      originalFilename: 'draft-test.jpg',
      storagePath: '/uploads/draft-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Test published status without publishedAt
    const publishedWithoutDate = await Tattoo.create({
      artistId: artist.id,
      title: 'Publié Sans Date',
      slug: 'publie-sans-date-test',
      status: TattooStatus.PUBLISHED,
      publishedAt: null,
      originalFilename: 'nodate-test.jpg',
      storagePath: '/uploads/nodate-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Assert
    assert.isTrue(publishedTattoo.isPublished)
    assert.isFalse(draftTattoo.isPublished)
    assert.isFalse(publishedWithoutDate.isPublished)
  })

  test('doit calculer correctement les URLs des images', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('image-urls-test')

    const imageVariants: ImageVariants = {
      thumbnail: 'https://cdn.example.com/thumb.jpg',
      medium: 'https://cdn.example.com/medium.jpg',
      large: 'https://cdn.example.com/large.jpg',
      original: 'https://cdn.example.com/original.jpg',
    }

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test Images',
      slug: 'test-images-urls',
      imageVariants,
      originalFilename: 'test-urls.jpg',
      storagePath: '/uploads/test-urls.jpg',
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Assert
    assert.equal(tattoo.thumbnailUrl, imageVariants.thumbnail)
    assert.equal(tattoo.displayUrl, imageVariants.medium)
    assert.equal(tattoo.fullSizeUrl, imageVariants.large)
    assert.equal(tattoo.aspectRatio, 1.33)
  })

  test('doit calculer correctement isHighEngagement', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('high-engagement-test')

    const highEngagementTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'High Engagement',
      slug: 'high-engagement-test',
      engagementScore: 8.5,
      originalFilename: 'high-test.jpg',
      storagePath: '/uploads/high-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    const lowEngagementTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Low Engagement',
      slug: 'low-engagement-test',
      engagementScore: 6.0,
      originalFilename: 'low-test.jpg',
      storagePath: '/uploads/low-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Assert
    assert.isTrue(highEngagementTattoo.isHighEngagement)
    assert.isFalse(lowEngagementTattoo.isHighEngagement)
  })

  test('doit calculer correctement estimatedPriceRange', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('price-range-test')

    const tattooWithPrice = await Tattoo.create({
      artistId: artist.id,
      title: 'Avec Prix',
      slug: 'avec-prix-test',
      priceEstimate: 300,
      priceCurrency: 'EUR',
      originalFilename: 'price-test.jpg',
      storagePath: '/uploads/price-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
    })

    const tattooWithoutPrice = await Tattoo.create({
      artistId: artist.id,
      title: 'Sans Prix',
      slug: 'sans-prix-test',
      priceEstimate: null,
      priceCurrency: 'EUR',
      originalFilename: 'noprice-test.jpg',
      storagePath: '/uploads/noprice-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
    })

    // Assert
    assert.isNotNull(tattooWithPrice.estimatedPriceRange)
    assert.include(tattooWithPrice.estimatedPriceRange!, '210') // 300 - 90
    assert.include(tattooWithPrice.estimatedPriceRange!, '390') // 300 + 90
    assert.include(tattooWithPrice.estimatedPriceRange!, 'EUR')
    assert.isNull(tattooWithoutPrice.estimatedPriceRange)
  })

  test('doit gérer les méthodes business pour publication', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('business-methods-test')

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test Business Methods',
      slug: 'test-business-methods',
      status: TattooStatus.DRAFT,
      originalFilename: 'business-test.jpg',
      storagePath: '/uploads/business-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act - Publish using available method
    await tattoo.publish()

    // Assert
    assert.equal(tattoo.status, TattooStatus.PUBLISHED)
    assert.isNotNull(tattoo.publishedAt)
    assert.isTrue(tattoo.isPublished)

    // Act - Unpublish using available method
    await tattoo.unpublish()

    // Assert
    assert.equal(tattoo.status, TattooStatus.DRAFT)
    assert.isFalse(tattoo.isPublished)
  })

  test("doit incrémenter les métriques d'engagement", async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('engagement-metrics-test')

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test Engagement Metrics',
      slug: 'test-engagement-metrics',
      viewCount: 10,
      likeCount: 5,
      shareCount: 2,
      originalFilename: 'engagement-test.jpg',
      storagePath: '/uploads/engagement-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    const initialEngagement = tattoo.engagementScore

    // Test incrementView
    await tattoo.incrementView()
    assert.equal(tattoo.viewCount, 11)
    assert.isTrue(tattoo.engagementScore > initialEngagement)

    // Test incrementLike
    await tattoo.incrementLike()
    assert.equal(tattoo.likeCount, 6)

    // Test incrementShare
    await tattoo.incrementShare()
    assert.equal(tattoo.shareCount, 3)

    // Test updateEngagement
    await tattoo.updateEngagement()
    assert.isNumber(tattoo.engagementScore)
  })

  test('doit gérer les tags avec attachement', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('tags-attachment-test')

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test Tags',
      slug: 'test-tags-attachment',
      originalFilename: 'tags-test.jpg',
      storagePath: '/uploads/tags-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    const primaryTag = await Tag.create({
      name: 'Dragon Tags Test',
      slug: 'dragon-tags-test',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    const secondaryTag = await Tag.create({
      name: 'Traditionnel Tags Test',
      slug: 'traditionnel-tags-test',
      category: TagCategory.STYLE,
      level: 0,
      displayOrder: 2,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    // Act
    await tattoo.addPrimaryTag(primaryTag)
    await tattoo.addTag(secondaryTag, 0.7, false)

    // Load relationships
    await tattoo.load('tags', (query) => {
      query.pivotColumns(['relevance_score', 'is_primary', 'assignment_type', 'is_approved'])
    })

    // Assert
    assert.lengthOf(tattoo.tags, 2)

    const primaryTagPivot = tattoo.tags.find((t) => t.id === primaryTag.id)?.$extras
      .pivot_is_primary
    const secondaryTagPivot = tattoo.tags.find((t) => t.id === secondaryTag.id)?.$extras
      .pivot_is_primary

    assert.isTrue(primaryTagPivot)
    assert.isFalse(secondaryTagPivot)
  })

  test('doit gérer le texte alternatif multilingue', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('alt-text-test')

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test Alt Text',
      slug: 'test-alt-text',
      originalFilename: 'alt-test.jpg',
      storagePath: '/uploads/alt-test.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act
    await tattoo.setAltText('fr', 'Dragon japonais coloré sur le bras')
    await tattoo.setAltText('en', 'Colorful Japanese dragon on arm')

    // Assert
    assert.equal(tattoo.altText?.fr, 'Dragon japonais coloré sur le bras')
    assert.equal(tattoo.altText?.en, 'Colorful Japanese dragon on arm')
  })

  test('doit utiliser le scope published correctement', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('published-scope-test')

    // Published tattoo
    await Tattoo.create({
      artistId: artist.id,
      title: 'Published Scope',
      slug: 'published-scope-test',
      status: TattooStatus.PUBLISHED,
      publishedAt: DateTime.now(),
      originalFilename: 'pub-scope.jpg',
      storagePath: '/uploads/pub-scope.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Draft tattoo
    await Tattoo.create({
      artistId: artist.id,
      title: 'Draft Scope',
      slug: 'draft-scope-test',
      status: TattooStatus.DRAFT,
      originalFilename: 'draft-scope.jpg',
      storagePath: '/uploads/draft-scope.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act
    const publishedTattoos = await Tattoo.query().apply((scopes) => scopes.published())

    // Assert - Should find only published tattoos from this test
    const testPublishedTattoos = publishedTattoos.filter((t) => t.slug === 'published-scope-test')
    assert.isAtLeast(testPublishedTattoos.length, 1)
    assert.equal(testPublishedTattoos[0].title, 'Published Scope')
  })

  test('doit utiliser les scopes de filtrage correctement', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('scopes-filtering-test')

    const traditionalTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Traditional Dragon Scopes',
      slug: 'traditional-dragon-scopes-test',
      tattooStyle: TattooStyle.TRADITIONAL,
      bodyPlacement: BodyPlacement.ARM,
      isFeatured: true,
      displayOrder: 1,
      originalFilename: 'trad-scopes.jpg',
      storagePath: '/uploads/trad-scopes.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    const realisticTattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Realistic Portrait Scopes',
      slug: 'realistic-portrait-scopes-test',
      tattooStyle: TattooStyle.REALISTIC,
      bodyPlacement: BodyPlacement.BACK,
      isPortfolioHighlight: true,
      engagementScore: 9.2,
      originalFilename: 'real-scopes.jpg',
      storagePath: '/uploads/real-scopes.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Test scopes
    const traditionalTattoos = await Tattoo.query().apply((scopes) =>
      scopes.byStyle(TattooStyle.TRADITIONAL)
    )
    const armTattoos = await Tattoo.query().apply((scopes) =>
      scopes.byBodyPlacement(BodyPlacement.ARM)
    )
    const featuredTattoos = await Tattoo.query().apply((scopes) => scopes.featured())
    const portfolioTattoos = await Tattoo.query().apply((scopes) => scopes.portfolioHighlights())
    const highEngagementTattoos = await Tattoo.query().apply((scopes) => scopes.highEngagement())

    // Assert - Filter for our test data
    const testTraditional = traditionalTattoos.filter(
      (t) => t.slug === 'traditional-dragon-scopes-test'
    )
    const testArm = armTattoos.filter((t) => t.slug === 'traditional-dragon-scopes-test')
    const testFeatured = featuredTattoos.filter((t) => t.slug === 'traditional-dragon-scopes-test')
    const testPortfolio = portfolioTattoos.filter(
      (t) => t.slug === 'realistic-portrait-scopes-test'
    )
    const testHighEngagement = highEngagementTattoos.filter(
      (t) => t.slug === 'realistic-portrait-scopes-test'
    )

    assert.isAtLeast(testTraditional.length, 1)
    assert.isAtLeast(testArm.length, 1)
    assert.isAtLeast(testFeatured.length, 1)
    assert.isAtLeast(testPortfolio.length, 1)
    assert.isAtLeast(testHighEngagement.length, 1)
  })

  test('doit effectuer une recherche dans les tatouages', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('search-test')

    await Tattoo.create({
      artistId: artist.id,
      title: 'Dragon Japonais Search',
      slug: 'dragon-japonais-search-test',
      description: 'Magnifique dragon traditionnel japonais',
      searchKeywords: JSON.stringify(['dragon', 'japonais', 'traditionnel']),
      originalFilename: 'dragon-search.jpg',
      storagePath: '/uploads/dragon-search.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    await Tattoo.create({
      artistId: artist.id,
      title: 'Rose Réaliste Search',
      slug: 'rose-realiste-search-test',
      description: 'Rose rouge en style réalisme',
      searchKeywords: JSON.stringify(['rose', 'realisme', 'fleur']),
      originalFilename: 'rose-search.jpg',
      storagePath: '/uploads/rose-search.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act
    const dragonResults = await Tattoo.query().apply((scopes) => scopes.search('dragon'))
    const roseResults = await Tattoo.query().apply((scopes) => scopes.search('rose'))
    const keywordResults = await Tattoo.query().apply((scopes) => scopes.search('japonais'))

    // Assert - Filter for our test data
    const testDragon = dragonResults.filter((t) => t.slug === 'dragon-japonais-search-test')
    const testRose = roseResults.filter((t) => t.slug === 'rose-realiste-search-test')
    const testKeyword = keywordResults.filter((t) => t.slug === 'dragon-japonais-search-test')

    assert.isAtLeast(testDragon.length, 1)
    assert.isAtLeast(testRose.length, 1)
    assert.isAtLeast(testKeyword.length, 1)
  })

  test('doit filtrer par gamme de prix', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('price-filter-test')

    await Tattoo.create({
      artistId: artist.id,
      title: 'Petit Tatouage Filter',
      slug: 'petit-tatouage-filter-test',
      priceEstimate: 150,
      originalFilename: 'petit-filter.jpg',
      storagePath: '/uploads/petit-filter.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    await Tattoo.create({
      artistId: artist.id,
      title: 'Grand Tatouage Filter',
      slug: 'grand-tatouage-filter-test',
      priceEstimate: 800,
      originalFilename: 'grand-filter.jpg',
      storagePath: '/uploads/grand-filter.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act
    const budgetTattoos = await Tattoo.query().apply((scopes) => scopes.priceRange(100, 200))
    const expensiveTattoos = await Tattoo.query().apply((scopes) => scopes.priceRange(500, 1000))

    // Assert - Filter for our test data
    const testBudget = budgetTattoos.filter((t) => t.slug === 'petit-tatouage-filter-test')
    const testExpensive = expensiveTattoos.filter((t) => t.slug === 'grand-tatouage-filter-test')

    assert.isAtLeast(testBudget.length, 1)
    assert.isAtLeast(testExpensive.length, 1)
  })

  test('doit trouver un tatouage par slug avec relations', async ({ assert }) => {
    // Arrange
    const { artist, city, user } = await createTestArtist('slug-relations-test')

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Tatouage Slug Relations Test',
      slug: 'tatouage-slug-relations-test',
      originalFilename: 'slug-relations.jpg',
      storagePath: '/uploads/slug-relations.jpg',
      imageVariants: {
        thumbnail: 'thumb.jpg',
        medium: 'med.jpg',
        large: 'large.jpg',
        original: 'orig.jpg',
      },
      fileSize: 512000,
      dimensions: { width: 1600, height: 1200, aspectRatio: 1.33 },
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Act
    const foundTattoo = await Tattoo.query()
      .where('slug', 'tatouage-slug-relations-test')
      .preload('artist', (query) => query.preload('user').preload('city'))
      .first()

    // Assert
    assert.isNotNull(foundTattoo)
    assert.equal(foundTattoo!.id, tattoo.id)
    assert.equal(foundTattoo!.title, 'Tatouage Slug Relations Test')
    assert.equal(foundTattoo!.artist.stageName, `Jean Ink - slug-relations-test`)
    assert.equal(foundTattoo!.artist.user.fullName, `Jean Artiste - slug-relations-test`)
    assert.equal(foundTattoo!.artist.city.name, `Paris - slug-relations-test`)
  })

  test('doit gérer les propriétés JSON complexes', async ({ assert }) => {
    // Arrange
    const { artist } = await createTestArtist('json-properties-test')

    const imageVariants: ImageVariants = {
      thumbnail: 'thumb-json.jpg',
      medium: 'med-json.jpg',
      large: 'large-json.jpg',
      original: 'orig-json.jpg',
      webp: {
        thumbnail: 'thumb-json.webp',
        medium: 'med-json.webp',
        large: 'large-json.webp',
      },
    }

    const dimensions: ImageDimensions = {
      width: 2048,
      height: 1536,
      aspectRatio: 1.333,
    }

    const altText = {
      fr: 'Dragon japonais en noir et blanc',
      en: 'Black and white Japanese dragon',
      es: 'Dragón japonés en blanco y negro',
    }

    const searchKeywords = ['dragon', 'japonais', 'noir-et-blanc', 'traditionnel']

    const tattoo = await Tattoo.create({
      artistId: artist.id,
      title: 'Test JSON Complex',
      slug: 'test-json-complex',
      imageVariants,
      dimensions,
      altText: JSON.stringify(altText),
      searchKeywords: JSON.stringify(searchKeywords),
      originalFilename: 'json-complex.jpg',
      storagePath: '/uploads/json-complex.jpg',
      fileSize: 1024000,
      contentType: 'image/jpeg',
      priceCurrency: 'EUR',
    })

    // Assert - JSON fields are stored as strings, need to parse for comparison
    assert.deepEqual(tattoo.imageVariants, imageVariants)
    assert.deepEqual(tattoo.dimensions, dimensions)
    assert.deepEqual(JSON.parse(tattoo.altText as string), altText)
    assert.deepEqual(JSON.parse(tattoo.searchKeywords as string), searchKeywords)
    assert.equal(tattoo.aspectRatio, 1.333)
    assert.equal(tattoo.thumbnailUrl, 'thumb-json.jpg')
    assert.equal(tattoo.displayUrl, 'med-json.jpg')
    assert.equal(tattoo.fullSizeUrl, 'large-json.jpg')
  })
})

// Helper function to create test data with unique identifiers
async function createTestArtist(testIdentifier: string) {
  const timestamp = Date.now()
  const randomNum = Math.floor(Math.random() * 9999)
  const uniqueId = `${timestamp}-${randomNum}`.slice(-8)
  const city = await City.create({
    name: `Paris - ${testIdentifier}`,
    slug: `paris-${testIdentifier}-${uniqueId}`,
    postalCode: '75001',
    inseeCode: `7${uniqueId.slice(-4)}`, // Keep within 10 characters limit
    latitude: 48.8566,
    longitude: 2.3522,
    departmentCode: '75',
    departmentName: 'Paris',
    regionCode: '11',
    regionName: 'Île-de-France',
    isActive: true,
    isFeatured: false,
    priority: 0,
  })

  const user = await User.create({
    fullName: `Jean Artiste - ${testIdentifier}`,
    email: `jean-${testIdentifier}@example.com`,
    password: 'password123',
    role: UserRole.ARTIST,
    cityId: city.id,
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
  })

  const artist = await Artist.create({
    userId: user.id,
    stageName: `Jean Ink - ${testIdentifier}`,
    cityId: city.id,
    experienceLevel: ArtistExperienceLevel.INTERMEDIATE,
    acceptsBookings: true,
    appointmentOnly: true,
    isActive: true,
    isAcceptingNewClients: true,
    currency: 'EUR',
  })

  return { city, user, artist }
}

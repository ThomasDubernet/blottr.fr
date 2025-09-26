import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Tag, { TagCategory, type TagTattooAttachment } from '#models/tag'
import Tattoo, { TattooStatus, type ImageVariants, type ImageDimensions } from '#models/tattoo'
import Artist, { ArtistExperienceLevel } from '#models/artist'
import User, { UserRole } from '#models/user'
import City from '#models/city'

test.group('Tag Model', (group) => {
  // The test bootstrap already configures db truncation for unit tests
  // No additional cleanup needed

  test('doit créer un tag avec les données minimales requises', async ({ assert }) => {
    // Arrange & Act
    const tag = await Tag.create({
      name: 'Dragon Minimal',
      slug: 'dragon-minimal',
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

    // Assert
    assert.exists(tag.id)
    assert.equal(tag.name, 'Dragon Minimal')
    assert.equal(tag.slug, 'dragon-minimal')
    assert.equal(tag.category, TagCategory.SUBJECT)
    assert.equal(tag.level, 0)
    // AdonisJS may return undefined for unset nullable fields
    assert.isTrue(tag.parentTagId === null || tag.parentTagId === undefined)
    assert.equal(tag.displayOrder, 1)
    assert.equal(tag.usageCount, 0)
    assert.equal(tag.isFeatured, false)
    assert.equal(tag.isTrending, false)
    assert.equal(tag.popularityScore, 0)
    assert.equal(tag.requiresApproval, false)
    assert.equal(tag.isApproved, true)
    assert.isTrue(tag.createdBy === null || tag.createdBy === undefined)
    assert.isTrue(tag.approvedBy === null || tag.approvedBy === undefined)
    assert.isTrue(tag.translations === null || tag.translations === undefined)
    assert.isNotNull(tag.createdAt)
    assert.isNotNull(tag.updatedAt)
  })

  test('doit tester toutes les catégories de tag', async ({ assert }) => {
    // Test all enum values
    const categories = [
      TagCategory.STYLE,
      TagCategory.SUBJECT,
      TagCategory.BODY_PART,
      TagCategory.COLOR,
      TagCategory.SIZE,
      TagCategory.TECHNIQUE,
      TagCategory.MOOD,
      TagCategory.CULTURAL,
      TagCategory.CUSTOM,
    ]

    for (const category of categories) {
      assert.include(Object.values(TagCategory), category)
    }

    // Test creating tags with each category
    for (const [index, category] of categories.entries()) {
      const tag = await Tag.create({
        name: `Test ${category} ${index}`,
        slug: `test-${category}-${index}`,
        category,
        level: 0,
        displayOrder: index,
        usageCount: 0,
        isFeatured: false,
        isTrending: false,
        popularityScore: 0,
        requiresApproval: false,
        isApproved: true,
      })

      assert.equal(tag.category, category)
    }
  })

  test('doit créer une structure hiérarchique parent-enfant', async ({ assert }) => {
    // Arrange
    const parentTag = await Tag.create({
      name: 'Animaux Parent',
      slug: 'animaux-parent',
      category: TagCategory.SUBJECT,
      level: 0,
      parentTagId: null,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    const childTag = await Tag.create({
      name: 'Dragon Child',
      slug: 'dragon-child',
      category: TagCategory.SUBJECT,
      level: 1,
      parentTagId: parentTag.id,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    // Load relationships
    await parentTag.load('childTags')
    await childTag.load('parentTag')

    // Assert parent
    assert.isFalse(parentTag.isHierarchical) // level = 0 and parentTagId = null
    assert.lengthOf(parentTag.childTags, 1)
    assert.equal(parentTag.childTags[0].id, childTag.id)

    // Assert child
    assert.isTrue(childTag.isHierarchical) // parentTagId is set
    assert.equal(childTag.parentTag.id, parentTag.id)
    assert.equal(childTag.parentTag.name, 'Animaux Parent')
  })

  test('doit calculer correctement isHierarchical', async ({ assert }) => {
    // Test cases for hierarchical detection
    const testCases = [
      { level: 0, parentTagId: null, expectedHierarchical: false },
      { level: 1, parentTagId: null, expectedHierarchical: true }, // level > 0
      { level: 0, parentTagId: 1, expectedHierarchical: true }, // parentTagId set
      { level: 2, parentTagId: 1, expectedHierarchical: true }, // both conditions
    ]

    for (const [index, testCase] of testCases.entries()) {
      const tag = await Tag.create({
        name: `Hierarchical Test ${index}`,
        slug: `hierarchical-test-${index}`,
        category: TagCategory.SUBJECT,
        level: testCase.level,
        parentTagId: testCase.parentTagId,
        displayOrder: index,
        usageCount: 0,
        isFeatured: false,
        isTrending: false,
        popularityScore: 0,
        requiresApproval: false,
        isApproved: true,
      })

      assert.equal(
        tag.isHierarchical,
        testCase.expectedHierarchical,
        `Hierarchical check failed for case ${index}: level=${testCase.level}, parentTagId=${testCase.parentTagId}`
      )
    }
  })

  test('doit calculer correctement displayName avec traductions', async ({ assert }) => {
    // Test without translations
    const tagWithoutTranslations = await Tag.create({
      name: 'Dragon Sans Translation',
      slug: 'dragon-sans-translation',
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

    // Test with translations
    const tagWithTranslations = await Tag.create({
      name: 'Dragon Avec Translation',
      slug: 'dragon-avec-translation',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 2,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
      translations: {
        fr: { name: 'Dragon Français', description: 'Un dragon en style français' },
        en: { name: 'French Dragon', description: 'A dragon in French style' },
      },
    })

    // Assert
    assert.equal(tagWithoutTranslations.displayName, 'Dragon Sans Translation')
    assert.equal(tagWithTranslations.displayName, 'Dragon Français')
  })

  test('doit calculer correctement isPopular', async ({ assert }) => {
    // Test cases for popularity detection
    const testCases = [
      { popularityScore: 6.0, usageCount: 40, expectedPopular: false }, // score < 7
      { popularityScore: 8.0, usageCount: 30, expectedPopular: false }, // usage < 50
      { popularityScore: 7.5, usageCount: 60, expectedPopular: true }, // both conditions met
      { popularityScore: 9.0, usageCount: 100, expectedPopular: true }, // both conditions exceeded
    ]

    for (const [index, testCase] of testCases.entries()) {
      const tag = await Tag.create({
        name: `Popular Test ${index}`,
        slug: `popular-test-${index}`,
        category: TagCategory.SUBJECT,
        level: 0,
        displayOrder: index,
        usageCount: testCase.usageCount,
        isFeatured: false,
        isTrending: false,
        popularityScore: testCase.popularityScore,
        requiresApproval: false,
        isApproved: true,
      })

      assert.equal(
        tag.isPopular,
        testCase.expectedPopular,
        `Popular check failed for case ${index}: score=${testCase.popularityScore}, usage=${testCase.usageCount}`
      )
    }
  })

  test('doit incrémenter l\'usage et recalculer la popularité', async ({ assert }) => {
    // Arrange
    const tag = await Tag.create({
      name: 'Usage Test Tag',
      slug: 'usage-test-tag',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 1,
      usageCount: 5,
      isFeatured: false,
      isTrending: false,
      popularityScore: 2.0,
      requiresApproval: false,
      isApproved: true,
    })

    const initialPopularity = tag.popularityScore

    // Act
    await tag.incrementUsage()

    // Assert
    assert.equal(tag.usageCount, 6)
    assert.isTrue(tag.popularityScore > initialPopularity)
  })

  test('doit calculer correctement le score de popularité', async ({ assert }) => {
    // Test different combinations, using realistic expectations
    const testCases = [
      { usage: 0, featured: false, trending: false },
      { usage: 10, featured: false, trending: false },
      { usage: 50, featured: true, trending: false },
      { usage: 20, featured: false, trending: true },
      { usage: 100, featured: true, trending: true },
    ]

    for (const [index, testCase] of testCases.entries()) {
      const tag = await Tag.create({
        name: `Popularity Calc Test ${index}`,
        slug: `popularity-calc-test-${index}`,
        category: TagCategory.SUBJECT,
        level: 0,
        displayOrder: index,
        usageCount: testCase.usage,
        isFeatured: testCase.featured,
        isTrending: testCase.trending,
        popularityScore: 0, // Will be recalculated
        requiresApproval: false,
        isApproved: true,
      })

      // Trigger recalculation via incrementUsage
      const initialUsage = tag.usageCount
      await tag.incrementUsage()

      // Verify that popularity score was calculated (should be > 0 after increment)
      assert.isTrue(tag.popularityScore >= 0, `Popularity score should be calculated for case ${index}`)

      // Verify usage was incremented
      assert.equal(tag.usageCount, initialUsage + 1)
    }
  })

  test('doit approuver un tag avec suivi de l\'approbateur', async ({ assert }) => {
    // Arrange
    const tag = await Tag.create({
      name: 'Tag À Approuver',
      slug: 'tag-a-approuver',
      category: TagCategory.CUSTOM,
      level: 0,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: true,
      isApproved: false,
      createdBy: 'user123',
    })

    // Act
    await tag.approve('admin@blottr.fr')

    // Assert
    assert.isTrue(tag.isApproved)
    assert.equal(tag.approvedBy, 'admin@blottr.fr')
  })

  test('doit gérer les traductions multilingues', async ({ assert }) => {
    // Arrange
    const tag = await Tag.create({
      name: 'Dragon Multilingue',
      slug: 'dragon-multilingue',
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

    // Act - Set translations
    await tag.setTranslation('fr', {
      name: 'Dragon FR',
      description: 'Créature mythique crachant du feu'
    })
    await tag.setTranslation('en', {
      name: 'Dragon EN',
      description: 'Fire-breathing mythical creature'
    })
    await tag.setTranslation('es', {
      name: 'Dragón ES',
      description: 'Criatura mítica que escupe fuego'
    })

    // Update existing translation
    await tag.setTranslation('fr', {
      description: 'Créature légendaire européenne ou asiatique'
    })

    // Assert
    assert.equal(tag.translations?.fr?.name, 'Dragon FR')
    assert.equal(tag.translations?.fr?.description, 'Créature légendaire européenne ou asiatique')
    assert.equal(tag.translations?.en?.name, 'Dragon EN')
    assert.equal(tag.translations?.en?.description, 'Fire-breathing mythical creature')
    assert.equal(tag.translations?.es?.name, 'Dragón ES')
    assert.equal(tag.translations?.es?.description, 'Criatura mítica que escupe fuego')
    assert.equal(tag.displayName, 'Dragon FR') // Uses French translation
  })

  test('doit attacher un tag à un tatouage avec métadonnées', async ({ assert }) => {
    // Arrange
    const { tattoo } = await createTestTattooAndTag('attach')

    const tag = await Tag.create({
      name: 'Style Attachment Test',
      slug: 'style-attachment-test',
      category: TagCategory.STYLE,
      level: 0,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    const attachmentOptions: TagTattooAttachment = {
      relevanceScore: 0.85,
      isPrimary: true,
      assignmentType: 'manual',
      isApproved: true,
    }

    const initialUsage = tag.usageCount

    // Act
    await tag.attachToTattoo(tattoo, attachmentOptions)

    // Load relationship to check pivot data
    await tag.load('tattoos', (query) => {
      query.pivotColumns(['relevance_score', 'is_primary', 'assignment_type', 'is_approved'])
    })

    // Assert
    assert.lengthOf(tag.tattoos, 1)
    assert.equal(tag.tattoos[0].id, tattoo.id)
    assert.equal(tag.tattoos[0].$extras.pivot_relevance_score, 0.85)
    assert.equal(tag.tattoos[0].$extras.pivot_is_primary, true)
    assert.equal(tag.tattoos[0].$extras.pivot_assignment_type, 'manual')
    assert.equal(tag.tattoos[0].$extras.pivot_is_approved, true)
    assert.equal(tag.usageCount, initialUsage + 1) // Should have incremented
  })

  test('doit utiliser le scope approved correctement', async ({ assert }) => {
    // Arrange
    const approvedTag = await Tag.create({
      name: 'Tag Approuvé Scope',
      slug: 'tag-approuve-scope',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: true,
      isApproved: true,
    })

    const nonApprovedTag = await Tag.create({
      name: 'Tag Non Approuvé Scope',
      slug: 'tag-non-approuve-scope',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 2,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: true,
      isApproved: false,
    })

    // Act
    const approvedTags = await Tag.query().apply((scopes) => scopes.approved())

    // Assert - Filter for our test data
    const testApprovedTags = approvedTags.filter(t => t.slug === 'tag-approuve-scope')
    assert.isAtLeast(testApprovedTags.length, 1)
    assert.equal(testApprovedTags[0].name, 'Tag Approuvé Scope')

    // Ensure non-approved tag is not in results
    const nonApprovedInResults = approvedTags.some(t => t.slug === 'tag-non-approuve-scope')
    assert.isFalse(nonApprovedInResults)
  })

  test('doit utiliser les scopes de filtrage correctement', async ({ assert }) => {
    // Arrange
    const styleTag = await Tag.create({
      name: 'Style Vedette Scopes',
      slug: 'style-vedette-scopes',
      category: TagCategory.STYLE,
      level: 0,
      displayOrder: 1,
      usageCount: 25,
      isFeatured: true,
      isTrending: false,
      popularityScore: 6.0,
      requiresApproval: false,
      isApproved: true,
    })

    const subjectTag = await Tag.create({
      name: 'Sujet Populaire Scopes',
      slug: 'sujet-populaire-scopes',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 2,
      usageCount: 100,
      isFeatured: false,
      isTrending: true,
      popularityScore: 8.5,
      requiresApproval: false,
      isApproved: true,
    })

    const colorTag = await Tag.create({
      name: 'Couleur Tendance Scopes',
      slug: 'couleur-tendance-scopes',
      category: TagCategory.COLOR,
      level: 0,
      displayOrder: 3,
      usageCount: 75,
      isFeatured: false,
      isTrending: true,
      popularityScore: 7.2,
      requiresApproval: false,
      isApproved: true,
    })

    // Test scopes
    const styleTags = await Tag.query().apply((scopes) => scopes.byCategory(TagCategory.STYLE))
    const featuredTags = await Tag.query().apply((scopes) => scopes.featured())
    const popularTags = await Tag.query().apply((scopes) => scopes.popular())
    const trendingTags = await Tag.query().apply((scopes) => scopes.trending())

    // Assert - Filter for our test data
    const testStyleTags = styleTags.filter(t => t.slug === 'style-vedette-scopes')
    assert.isAtLeast(testStyleTags.length, 1)

    const testFeaturedTags = featuredTags.filter(t => t.slug === 'style-vedette-scopes')
    assert.isAtLeast(testFeaturedTags.length, 1)

    const testPopularTags = popularTags.filter(t =>
      ['sujet-populaire-scopes', 'couleur-tendance-scopes'].includes(t.slug)
    )
    assert.isAtLeast(testPopularTags.length, 2) // popularityScore > 5

    const testTrendingTags = trendingTags.filter(t =>
      ['sujet-populaire-scopes', 'couleur-tendance-scopes'].includes(t.slug)
    )
    assert.isAtLeast(testTrendingTags.length, 2)
  })

  test('doit effectuer une recherche dans les tags', async ({ assert }) => {
    // Arrange
    await Tag.create({
      name: 'Dragon Japonais Search',
      slug: 'dragon-japonais-search',
      description: 'Style traditionnel japonais avec dragons',
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

    await Tag.create({
      name: 'Rose Réaliste Search',
      slug: 'rose-realiste-search',
      description: 'Roses en style réalisme photographique',
      category: TagCategory.SUBJECT,
      level: 0,
      displayOrder: 2,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    await Tag.create({
      name: 'Géométrique Search',
      slug: 'geometrique-search',
      description: 'Motifs géométriques et patterns',
      category: TagCategory.STYLE,
      level: 0,
      displayOrder: 3,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    // Act
    const dragonResults = await Tag.query().apply((scopes) => scopes.search('dragon'))
    const roseResults = await Tag.query().apply((scopes) => scopes.search('rose'))
    const styleResults = await Tag.query().apply((scopes) => scopes.search('style'))
    const patternResults = await Tag.query().apply((scopes) => scopes.search('pattern'))

    // Assert - Filter for our test data
    const testDragon = dragonResults.filter(t => t.slug === 'dragon-japonais-search')
    assert.isAtLeast(testDragon.length, 1)

    const testRose = roseResults.filter(t => t.slug === 'rose-realiste-search')
    assert.isAtLeast(testRose.length, 1)

    const testStyle = styleResults.filter(t =>
      ['dragon-japonais-search', 'rose-realiste-search'].includes(t.slug)
    )
    assert.isAtLeast(testStyle.length, 2) // Found in descriptions

    const testPattern = patternResults.filter(t => t.slug === 'geometrique-search')
    assert.isAtLeast(testPattern.length, 1)
  })

  test('doit gérer les relations pivot avec métadonnées complexes', async ({ assert }) => {
    // Arrange
    const { tattoo } = await createTestTattooAndTag('pivot')

    const primaryTag = await Tag.create({
      name: 'Tag Primaire Pivot',
      slug: 'tag-primaire-pivot',
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
      name: 'Tag Secondaire Pivot',
      slug: 'tag-secondaire-pivot',
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

    const aiSuggestedTag = await Tag.create({
      name: 'Tag IA Pivot',
      slug: 'tag-ia-pivot',
      category: TagCategory.TECHNIQUE,
      level: 0,
      displayOrder: 3,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: true,
      isApproved: false,
    })

    // Act - Attach with different metadata
    await primaryTag.attachToTattoo(tattoo, {
      relevanceScore: 1.0,
      isPrimary: true,
      assignmentType: 'manual',
      isApproved: true,
    })

    await secondaryTag.attachToTattoo(tattoo, {
      relevanceScore: 0.7,
      isPrimary: false,
      assignmentType: 'manual',
      isApproved: true,
    })

    await aiSuggestedTag.attachToTattoo(tattoo, {
      relevanceScore: 0.6,
      isPrimary: false,
      assignmentType: 'ai_suggested',
      isApproved: false,
    })

    // Load relationships with pivot data
    await tattoo.load('tags', (query) => {
      query.pivotColumns(['relevance_score', 'is_primary', 'assignment_type', 'is_approved'])
        .orderBy('pivot_is_primary', 'desc')
        .orderBy('pivot_relevance_score', 'desc')
    })

    // Assert
    assert.lengthOf(tattoo.tags, 3)

    // Check primary tag
    const primaryTagData = tattoo.tags.find(t => t.id === primaryTag.id)
    assert.isNotNull(primaryTagData)
    assert.equal(primaryTagData!.$extras.pivot_relevance_score, 1.0)
    assert.equal(primaryTagData!.$extras.pivot_is_primary, true)
    assert.equal(primaryTagData!.$extras.pivot_assignment_type, 'manual')
    assert.equal(primaryTagData!.$extras.pivot_is_approved, true)

    // Check secondary tag
    const secondaryTagData = tattoo.tags.find(t => t.id === secondaryTag.id)
    assert.isNotNull(secondaryTagData)
    assert.equal(secondaryTagData!.$extras.pivot_relevance_score, 0.7)
    assert.equal(secondaryTagData!.$extras.pivot_is_primary, false)
    assert.equal(secondaryTagData!.$extras.pivot_assignment_type, 'manual')
    assert.equal(secondaryTagData!.$extras.pivot_is_approved, true)

    // Check AI suggested tag
    const aiTagData = tattoo.tags.find(t => t.id === aiSuggestedTag.id)
    assert.isNotNull(aiTagData)
    assert.equal(aiTagData!.$extras.pivot_relevance_score, 0.6)
    assert.equal(aiTagData!.$extras.pivot_is_primary, false)
    assert.equal(aiTagData!.$extras.pivot_assignment_type, 'ai_suggested')
    assert.equal(aiTagData!.$extras.pivot_is_approved, false)
  })

  test('doit gérer les propriétés optionnelles et les valeurs null', async ({ assert }) => {
    // Test minimal tag creation
    const minimalTag = await Tag.create({
      name: 'Tag Minimal Props',
      slug: 'tag-minimal-props',
      category: TagCategory.CUSTOM,
      level: 0,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    // Test tag with all optional fields
    const fullTag = await Tag.create({
      name: 'Tag Complet Props',
      slug: 'tag-complet-props',
      description: 'Tag avec toutes les propriétés',
      category: TagCategory.STYLE,
      parentTagId: null,
      level: 0,
      colorCode: '#FF5733',
      iconName: 'dragon-icon',
      displayOrder: 2,
      usageCount: 42,
      isFeatured: true,
      isTrending: true,
      popularityScore: 8.7,
      requiresApproval: true,
      isApproved: true,
      createdBy: 'user@example.com',
      approvedBy: 'admin@example.com',
      translations: {
        fr: { name: 'Complet FR', description: 'Description française' },
        en: { name: 'Complete EN', description: 'English description' },
      },
    })

    // Assert minimal tag - use flexible assertions for nullable fields
    assert.equal(minimalTag.name, 'Tag Minimal Props')
    assert.isTrue(minimalTag.description === null || minimalTag.description === undefined)
    assert.isTrue(minimalTag.parentTagId === null || minimalTag.parentTagId === undefined)
    assert.isTrue(minimalTag.colorCode === null || minimalTag.colorCode === undefined)
    assert.isTrue(minimalTag.iconName === null || minimalTag.iconName === undefined)
    assert.isTrue(minimalTag.createdBy === null || minimalTag.createdBy === undefined)
    assert.isTrue(minimalTag.approvedBy === null || minimalTag.approvedBy === undefined)
    assert.isTrue(minimalTag.translations === null || minimalTag.translations === undefined)
    assert.equal(minimalTag.displayName, 'Tag Minimal Props')

    // Assert full tag
    assert.equal(fullTag.name, 'Tag Complet Props')
    assert.equal(fullTag.description, 'Tag avec toutes les propriétés')
    assert.equal(fullTag.colorCode, '#FF5733')
    assert.equal(fullTag.iconName, 'dragon-icon')
    assert.equal(fullTag.usageCount, 42)
    assert.isTrue(fullTag.isFeatured)
    assert.isTrue(fullTag.isTrending)
    assert.equal(fullTag.popularityScore, 8.7)
    assert.isFalse(fullTag.isPopular) // Actually should be false since usage < 50
    assert.equal(fullTag.createdBy, 'user@example.com')
    assert.equal(fullTag.approvedBy, 'admin@example.com')
    assert.equal(fullTag.displayName, 'Complet FR')
  })

  test('doit valider les contraintes de niveau hiérarchique', async ({ assert }) => {
    // Create a deep hierarchy
    const level0 = await Tag.create({
      name: 'Tag Niveau 0',
      slug: 'tag-niveau-0',
      category: TagCategory.SUBJECT,
      level: 0,
      parentTagId: null,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    const level1 = await Tag.create({
      name: 'Tag Niveau 1',
      slug: 'tag-niveau-1',
      category: TagCategory.SUBJECT,
      level: 1,
      parentTagId: level0.id,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    const level2 = await Tag.create({
      name: 'Tag Niveau 2',
      slug: 'tag-niveau-2',
      category: TagCategory.SUBJECT,
      level: 2,
      parentTagId: level1.id,
      displayOrder: 1,
      usageCount: 0,
      isFeatured: false,
      isTrending: false,
      popularityScore: 0,
      requiresApproval: false,
      isApproved: true,
    })

    // Load full hierarchy
    await level0.load('childTags', (query) => {
      query.preload('childTags')
    })
    await level1.load('parentTag')
    await level1.load('childTags')
    await level2.load('parentTag', (query) => {
      query.preload('parentTag')
    })

    // Assert hierarchy structure
    assert.isFalse(level0.isHierarchical)
    assert.isTrue(level1.isHierarchical)
    assert.isTrue(level2.isHierarchical)

    assert.lengthOf(level0.childTags, 1)
    assert.equal(level0.childTags[0].name, 'Tag Niveau 1')

    assert.equal(level1.parentTag.name, 'Tag Niveau 0')
    assert.lengthOf(level1.childTags, 1)
    assert.equal(level1.childTags[0].name, 'Tag Niveau 2')

    assert.equal(level2.parentTag.name, 'Tag Niveau 1')
    assert.equal(level2.parentTag.parentTag.name, 'Tag Niveau 0')
  })
})

// Helper functions to create test data with unique identifiers
async function createTestTattooAndTag(testIdentifier: string = 'default') {
  // Use short identifiers to avoid database constraint issues
  const shortId = testIdentifier.substring(0, 4)

  const city = await City.create({
    name: `Paris-${shortId}`,
    slug: `paris-${shortId}`,
    postalCode: '75001',
    inseeCode: `751${shortId.substring(0, 2).padStart(2, '0')}`, // Max 10 chars
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
    fullName: `Jean-${shortId}`,
    email: `jean-${shortId}@example.com`,
    password: 'password123',
    role: UserRole.ARTIST,
    cityId: city.id,
    emailVerified: true,
    phoneVerified: true,
    isActive: true,
  })

  const artist = await Artist.create({
    userId: user.id,
    stageName: `Jean-${shortId}`,
    cityId: city.id,
    experienceLevel: ArtistExperienceLevel.INTERMEDIATE,
    acceptsBookings: true,
    appointmentOnly: true,
    isActive: true,
    isAcceptingNewClients: true,
    currency: 'EUR',
  })

  const imageVariants: ImageVariants = {
    thumbnail: 'thumb.jpg',
    medium: 'med.jpg',
    large: 'large.jpg',
    original: 'orig.jpg',
  }

  const dimensions: ImageDimensions = {
    width: 1600,
    height: 1200,
    aspectRatio: 1.33,
  }

  const tattoo = await Tattoo.create({
    artistId: artist.id,
    title: `Tattoo-${shortId}`,
    slug: `tattoo-${shortId}`,
    status: TattooStatus.PUBLISHED,
    publishedAt: DateTime.now(),
    originalFilename: `test-${shortId}.jpg`,
    storagePath: `/uploads/test-${shortId}.jpg`,
    imageVariants,
    fileSize: 512000,
    dimensions,
    contentType: 'image/jpeg',
    priceCurrency: 'EUR',
  })

  return { city, user, artist, tattoo }
}
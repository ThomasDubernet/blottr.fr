import { test } from '@japa/runner'
import Artist from '#models/artist'
import User, { UserRole } from '#models/user'
import City from '#models/city'
import Salon from '#models/salon'
import { DateTime } from 'luxon'

test.group('ArtistsController - API Public', (group) => {
  group.each.setup(async () => {
    // Clean up tables before each test
    await Artist.query().delete()
    await Salon.query().delete()
    await User.query().where('role', UserRole.ARTIST).delete()
  })

  test('GET /artists - doit retourner tous les artistes avec leurs relations en JSON', async ({
    client,
    assert,
  }) => {
    // Arrange - Create test data
    const city = await City.firstOrCreate(
      { name: 'Paris' },
      {
        name: 'Paris',
        slug: 'paris',
        postalCode: '75000',
        inseeCode: '75056',
        latitude: 48.8566,
        longitude: 2.3522,
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        isActive: true,
        isFeatured: false,
        priority: 1,
      }
    )

    const user = await User.create({
      email: 'artist@example.com',
      password: 'Password123',
      role: UserRole.ARTIST,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
    })

    const salon = await Salon.create({
      name: 'Studio Ink',
      slug: 'studio-ink',
      cityId: city.id,
      address: '123 Rue de Paris',
      postalCode: '75001',
      latitude: 48.8566,
      longitude: 2.3522,
      isActive: true,
      verificationStatus: 'unverified',
      acceptsWalkIns: true,
      appointmentRequired: false,
      isFeatured: false,
      priority: 1,
      totalReviews: 0,
      totalArtists: 0,
      currency: 'EUR',
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Ink Master',
      slug: 'ink-master',
      bio: 'Artiste tatoueur professionnel',
      shortBio: 'Spécialiste du traditionnel',
      specialty: 'Traditional',
      yearsExperience: 5,
      startedTattooingAt: DateTime.now().minus({ years: 5 }),
      experienceLevel: 'intermediate',
      artStyles: ['traditional', 'neo-traditional'],
      cityId: city.id,
      primarySalonId: salon.id,
      acceptsBookings: true,
      appointmentOnly: true,
      minPrice: 100,
      maxPrice: 500,
      currency: 'EUR',
      portfolioImages: ['image1.jpg', 'image2.jpg'],
      instagramHandle: '@inkmaster',
      instagramUrl: 'https://instagram.com/inkmaster',
      website: 'https://inkmaster.com',
      verificationStatus: 'verified',
      verifiedAt: DateTime.now(),
      isActive: true,
      isFeatured: true,
      isAcceptingNewClients: true,
      priority: 1,
      averageRating: 4.5,
      totalReviews: 10,
      totalTattoos: 50,
      profileViews: 1000,
      hasHealthCertificate: true,
      hasProfessionalInsurance: true,
    })

    // Act
    const response = await client.get('/api/artists')

    // Assert
    response.assertStatus(200)

    const body = response.body()
    assert.isArray(body)
    assert.lengthOf(body, 1)

    // Verify artist data
    const artistData = body[0]
    assert.equal(artistData.id, artist.id)
    assert.equal(artistData.stageName, 'Ink Master')
    assert.equal(artistData.slug, 'ink-master')
    assert.equal(artistData.bio, 'Artiste tatoueur professionnel')
    assert.equal(artistData.specialty, 'Traditional')
    assert.equal(artistData.yearsExperience, 5)
    assert.equal(artistData.experienceLevel, 'intermediate')
    assert.deepEqual(artistData.artStyles, ['traditional', 'neo-traditional'])
    assert.equal(artistData.minPrice, 100)
    assert.equal(artistData.maxPrice, 500)
    assert.equal(artistData.currency, 'EUR')
    assert.deepEqual(artistData.portfolioImages, ['image1.jpg', 'image2.jpg'])
    assert.equal(artistData.instagramHandle, '@inkmaster')
    assert.equal(artistData.verificationStatus, 'verified')
    assert.isTrue(artistData.isActive)
    assert.isTrue(artistData.isFeatured)

    // Verify user relationship
    assert.isDefined(artistData.user)
    assert.equal(artistData.user.id, user.id)
    assert.equal(artistData.user.email, 'artist@example.com')
    assert.equal(artistData.user.role, UserRole.ARTIST)

    // Verify city relationship
    assert.isDefined(artistData.city)
    assert.equal(artistData.city.id, city.id)
    assert.equal(artistData.city.name, 'Paris')

    // Verify primarySalon relationship
    assert.isDefined(artistData.primarySalon)
    assert.equal(artistData.primarySalon.id, salon.id)
    assert.equal(artistData.primarySalon.name, 'Studio Ink')
  })

  test('GET /artists - doit retourner une liste vide si aucun artiste', async ({
    client,
    assert,
  }) => {
    // Act
    const response = await client.get('/api/artists')

    // Assert
    response.assertStatus(200)

    const body = response.body()
    assert.isArray(body)
    assert.lengthOf(body, 0)
  })

  test('GET /artists - doit retourner plusieurs artistes', async ({ client, assert }) => {
    // Arrange
    const city = await City.firstOrCreate(
      { name: 'Paris' },
      {
        name: 'Paris',
        slug: 'paris',
        postalCode: '75000',
        inseeCode: '75056',
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        isActive: true,
        isFeatured: false,
        priority: 1,
        latitude: 48.8566,
        longitude: 2.3522,
      }
    )

    // Create 3 artists
    for (let i = 1; i <= 3; i++) {
      const user = await User.create({
        email: `artist${i}@example.com`,
        password: 'Password123',
        role: UserRole.ARTIST,
        isActive: true,
        emailVerified: true,
        phoneVerified: false,
      })

      await Artist.create({
        userId: user.id,
        stageName: `Artist ${i}`,
        slug: `artist-${i}`,
        cityId: city.id,
        experienceLevel: 'intermediate',
        currency: 'EUR',
        verificationStatus: 'unverified',
        isActive: true,
        isFeatured: false,
        isAcceptingNewClients: true,
        acceptsBookings: true,
        appointmentOnly: true,
        hasHealthCertificate: false,
        hasProfessionalInsurance: false,
        totalReviews: 0,
        totalTattoos: 0,
        profileViews: 0,
        priority: i,
      })
    }

    // Act
    const response = await client.get('/api/artists')

    // Assert
    response.assertStatus(200)

    const body = response.body()
    assert.isArray(body)
    assert.lengthOf(body, 3)

    // Verify all artists have their relations
    for (const artist of body) {
      assert.isDefined(artist.user)
      assert.isDefined(artist.city)
      assert.equal(artist.user.role, UserRole.ARTIST)
      assert.equal(artist.city.name, 'Paris')
    }
  })

  test('GET /artists - doit retourner les artistes inactifs aussi (sans filtre)', async ({
    client,
    assert,
  }) => {
    // Arrange
    const city = await City.firstOrCreate(
      { name: 'Paris' },
      {
        name: 'Paris',
        slug: 'paris',
        postalCode: '75000',
        inseeCode: '75056',
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        isActive: true,
        isFeatured: false,
        priority: 1,
        latitude: 48.8566,
        longitude: 2.3522,
      }
    )

    const user1 = await User.create({
      email: 'active@example.com',
      password: 'Password123',
      role: UserRole.ARTIST,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
    })

    const user2 = await User.create({
      email: 'inactive@example.com',
      password: 'Password123',
      role: UserRole.ARTIST,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
    })

    await Artist.create({
      userId: user1.id,
      stageName: 'Active Artist',
      slug: 'active-artist',
      cityId: city.id,
      experienceLevel: 'intermediate',
      currency: 'EUR',
      verificationStatus: 'verified',
      isActive: true, // Active
      isFeatured: false,
      isAcceptingNewClients: true,
      acceptsBookings: true,
      appointmentOnly: true,
      hasHealthCertificate: false,
      hasProfessionalInsurance: false,
      totalReviews: 0,
      totalTattoos: 0,
      profileViews: 0,
      priority: 1,
    })

    await Artist.create({
      userId: user2.id,
      stageName: 'Inactive Artist',
      slug: 'inactive-artist',
      cityId: city.id,
      experienceLevel: 'intermediate',
      currency: 'EUR',
      verificationStatus: 'unverified',
      isActive: false, // Inactive
      isFeatured: false,
      isAcceptingNewClients: false,
      acceptsBookings: false,
      appointmentOnly: true,
      hasHealthCertificate: false,
      hasProfessionalInsurance: false,
      totalReviews: 0,
      totalTattoos: 0,
      profileViews: 0,
      priority: 2,
    })

    // Act
    const response = await client.get('/api/artists')

    // Assert
    response.assertStatus(200)

    const body = response.body()
    assert.isArray(body)
    assert.lengthOf(body, 2) // Both active and inactive returned

    const stageNames = body.map((artist: any) => artist.stageName)
    assert.includeMembers(stageNames, ['Active Artist', 'Inactive Artist'])
  })

  test('GET /artists - doit sérialiser correctement les JSON columns', async ({
    client,
    assert,
  }) => {
    // Arrange
    const city = await City.firstOrCreate(
      { name: 'Paris' },
      {
        name: 'Paris',
        slug: 'paris',
        postalCode: '75000',
        inseeCode: '75056',
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        isActive: true,
        isFeatured: false,
        priority: 1,
        latitude: 48.8566,
        longitude: 2.3522,
      }
    )

    const user = await User.create({
      email: 'artist@example.com',
      password: 'Password123',
      role: UserRole.ARTIST,
      isActive: true,
      emailVerified: true,
      phoneVerified: false,
    })

    await Artist.create({
      userId: user.id,
      stageName: 'JSON Test Artist',
      slug: 'json-test-artist',
      cityId: city.id,
      experienceLevel: 'intermediate',
      currency: 'EUR',
      artStyles: ['traditional', 'neo-traditional', 'japanese'],
      portfolioImages: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      availability: {
        monday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        tuesday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
        wednesday: { isAvailable: false },
      },
      socialLinks: {
        facebook: 'https://facebook.com/artist',
        twitter: 'https://twitter.com/artist',
      },
      seoKeywords: ['tattoo', 'paris', 'traditional'],
      verificationStatus: 'verified',
      isActive: true,
      isFeatured: false,
      isAcceptingNewClients: true,
      acceptsBookings: true,
      appointmentOnly: true,
      hasHealthCertificate: false,
      hasProfessionalInsurance: false,
      totalReviews: 0,
      totalTattoos: 0,
      profileViews: 0,
      priority: 1,
    })

    // Act
    const response = await client.get('/api/artists')

    // Assert
    response.assertStatus(200)

    const body = response.body()
    const artistData = body[0]

    // Verify JSON columns are properly serialized
    assert.isArray(artistData.artStyles)
    assert.deepEqual(artistData.artStyles, ['traditional', 'neo-traditional', 'japanese'])

    assert.isArray(artistData.portfolioImages)
    assert.deepEqual(artistData.portfolioImages, ['img1.jpg', 'img2.jpg', 'img3.jpg'])

    assert.isObject(artistData.availability)
    assert.isTrue(artistData.availability.monday.isAvailable)
    assert.equal(artistData.availability.monday.startTime, '09:00')

    assert.isObject(artistData.socialLinks)
    assert.equal(artistData.socialLinks.facebook, 'https://facebook.com/artist')

    assert.isArray(artistData.seoKeywords)
    assert.deepEqual(artistData.seoKeywords, ['tattoo', 'paris', 'traditional'])
  })
})

import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Salon, { SalonVerificationStatus } from '#models/salon'
import City from '#models/city'
import Artist, { ArtistExperienceLevel } from '#models/artist'
import User, { UserRole } from '#models/user'

test.group('Salon Model', (group) => {
  group.each.setup(async () => {
    // Cleanup before each test
    await Salon.query().delete()
    await Artist.query().delete()
    await User.query().delete()
    await City.query().delete()
  })

  test('doit créer un salon avec les données minimales requises', async ({ assert }) => {
    // Arrange - Create a test city first
    const city = await City.create({
      name: 'Paris',
      slug: 'paris',
      postalCode: '75001',
      inseeCode: '75101',
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

    const salonData = {
      name: 'Ink Palace Studio',
      cityId: city.id,
      address: '15 rue de Rivoli',
      postalCode: '75001',
    }

    // Act
    const salon = await Salon.create(salonData)

    // Assert
    assert.exists(salon.id)
    assert.equal(salon.name, salonData.name)
    assert.equal(salon.slug, 'ink-palace-studio') // Auto-generated slug
    assert.equal(salon.cityId, city.id)
    assert.equal(salon.address, salonData.address)
    assert.equal(salon.postalCode, salonData.postalCode)
    assert.equal(salon.verificationStatus, SalonVerificationStatus.UNVERIFIED)
    assert.isTrue(salon.isActive)
    assert.isFalse(salon.isFeatured)
    assert.equal(salon.currency, 'EUR')
    assert.equal(salon.totalReviews, 0)
    assert.equal(salon.totalArtists, 0)
  })

  test('doit générer automatiquement un slug lors de la création', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Lyon',
      slug: 'lyon',
      postalCode: '69001',
      inseeCode: '69381',
      latitude: 45.764,
      longitude: 4.8357,
      departmentCode: '69',
      departmentName: 'Rhône',
      regionCode: '84',
      regionName: 'Auvergne-Rhône-Alpes',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    // Act
    const salon = await Salon.create({
      name: 'Le Salon des Arts & Tattoos',
      cityId: city.id,
      address: '42 rue de la République',
      postalCode: '69001',
    })

    // Assert
    assert.equal(salon.slug, 'le-salon-des-arts-and-tattoos')
  })

  test('doit trouver un salon par son slug', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Marseille',
      slug: 'marseille',
      postalCode: '13001',
      inseeCode: '13201',
      latitude: 43.2965,
      longitude: 5.3698,
      departmentCode: '13',
      departmentName: 'Bouches-du-Rhône',
      regionCode: '93',
      regionName: "Provence-Alpes-Côte d'Azur",
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Tattoo Provence',
      slug: 'tattoo-provence',
      cityId: city.id,
      address: '23 Canebière',
      postalCode: '13001',
    })

    // Act
    const foundSalon = await Salon.findBySlug('tattoo-provence')

    // Assert
    assert.isNotNull(foundSalon)
    assert.equal(foundSalon!.id, salon.id)
    assert.equal(foundSalon!.name, 'Tattoo Provence')
    assert.equal(foundSalon!.city.name, 'Marseille')
  })

  test('doit retourner null pour un slug inexistant', async ({ assert }) => {
    // Act
    const foundSalon = await Salon.findBySlug('salon-inexistant')

    // Assert
    assert.isNull(foundSalon)
  })

  test('doit calculer correctement le prix range formaté', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Bordeaux',
      slug: 'bordeaux',
      postalCode: '33000',
      inseeCode: '33063',
      latitude: 44.8378,
      longitude: -0.5792,
      departmentCode: '33',
      departmentName: 'Gironde',
      regionCode: '75',
      regionName: 'Nouvelle-Aquitaine',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Bordeaux Ink',
      cityId: city.id,
      address: "12 cours de l'Intendance",
      postalCode: '33000',
      priceRangeMin: 80,
      priceRangeMax: 300,
    })

    // Act & Assert
    assert.isNotNull(salon.priceRange)
    assert.include(salon.priceRange!, '80,00')
    assert.include(salon.priceRange!, '300,00')
    assert.include(salon.priceRange!, '€')
    assert.include(salon.priceRange!, '-')
  })

  test('doit calculer le prix range avec seulement un minimum', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Toulouse',
      slug: 'toulouse',
      postalCode: '31000',
      inseeCode: '31555',
      latitude: 43.6047,
      longitude: 1.4442,
      departmentCode: '31',
      departmentName: 'Haute-Garonne',
      regionCode: '76',
      regionName: 'Occitanie',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Toulouse Tattoo',
      cityId: city.id,
      address: '5 place du Capitole',
      postalCode: '31000',
      priceRangeMin: 120,
    })

    // Act & Assert
    assert.isNotNull(salon.priceRange)
    assert.include(salon.priceRange!, '120,00')
    assert.include(salon.priceRange!, '€')
    assert.include(salon.priceRange!, 'À partir de')
  })

  test('doit vérifier si le salon est ouvert selon les horaires', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Nice',
      slug: 'nice',
      postalCode: '06000',
      inseeCode: '06088',
      latitude: 43.7102,
      longitude: 7.262,
      departmentCode: '06',
      departmentName: 'Alpes-Maritimes',
      regionCode: '93',
      regionName: "Provence-Alpes-Côte d'Azur",
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const currentDay = DateTime.now().toFormat('cccc').toLowerCase()
    const openingHours = {
      [currentDay]: {
        isOpen: true,
        openTime: '09:00',
        closeTime: '19:00',
      },
    }

    const salon = await Salon.create({
      name: 'Nice Tattoo Studio',
      cityId: city.id,
      address: '10 avenue Jean Médecin',
      postalCode: '06000',
      openingHours,
    })

    // Act & Assert - This test might be flaky due to time dependency
    // In a real scenario, we would mock the current time
    const currentTime = DateTime.now().toFormat('HH:mm')
    if (currentTime >= '09:00' && currentTime <= '19:00') {
      assert.isTrue(salon.isOpen)
    } else {
      assert.isFalse(salon.isOpen)
    }
  })

  test('doit marquer un salon comme vérifié', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Nantes',
      slug: 'nantes',
      postalCode: '44000',
      inseeCode: '44109',
      latitude: 47.2184,
      longitude: -1.5536,
      departmentCode: '44',
      departmentName: 'Loire-Atlantique',
      regionCode: '52',
      regionName: 'Pays de la Loire',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Nantes Tattoo Art',
      cityId: city.id,
      address: '8 rue Crébillon',
      postalCode: '44000',
    })

    // Act
    await salon.markAsVerified('admin@blottr.fr', 'Salon vérifié par visite terrain')

    // Assert
    assert.equal(salon.verificationStatus, SalonVerificationStatus.VERIFIED)
    assert.equal(salon.verifiedBy, 'admin@blottr.fr')
    assert.equal(salon.verificationNotes, 'Salon vérifié par visite terrain')
    assert.isNotNull(salon.verifiedAt)
    assert.isTrue(salon.isVerified)
  })

  test('doit calculer la distance entre deux salons', async ({ assert }) => {
    // Arrange
    const cityParis = await City.create({
      name: 'Paris',
      slug: 'paris-test',
      postalCode: '75001',
      inseeCode: '75101',
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

    const salon = await Salon.create({
      name: 'Paris Tattoo',
      cityId: cityParis.id,
      address: '1 rue de Rivoli',
      postalCode: '75001',
      latitude: 48.8566,
      longitude: 2.3522,
    })

    // Coordinates for Lyon (approximately 465km from Paris)
    const lyonLat = 45.764
    const lyonLng = 4.8357

    // Act
    const distance = salon.distanceToKm(lyonLat, lyonLng)

    // Assert
    assert.isNotNull(distance)
    assert.approximately(distance!, 392, 10) // Within 10km margin (actual distance Paris-Lyon)
  })

  test('doit trouver les salons dans une ville', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Lille',
      slug: 'lille',
      postalCode: '59000',
      inseeCode: '59350',
      latitude: 50.6292,
      longitude: 3.0573,
      departmentCode: '59',
      departmentName: 'Nord',
      regionCode: '32',
      regionName: 'Hauts-de-France',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    // Create multiple salons
    await Salon.create({
      name: 'Lille Tattoo Studio',
      cityId: city.id,
      address: '20 rue de Béthune',
      postalCode: '59000',
      isFeatured: true,
      priority: 1,
    })

    await Salon.create({
      name: 'Art & Ink Lille',
      cityId: city.id,
      address: '5 place du Théâtre',
      postalCode: '59000',
      priority: 2,
    })

    await Salon.create({
      name: 'Inactive Salon',
      cityId: city.id,
      address: '10 rue inactive',
      postalCode: '59000',
      isActive: false, // This should not appear in results
    })

    // Act
    const salonsInCity = await Salon.findInCity(city.id)

    // Assert
    assert.lengthOf(salonsInCity, 2)
    assert.equal(salonsInCity[0].name, 'Lille Tattoo Studio') // Featured first
    assert.equal(salonsInCity[1].name, 'Art & Ink Lille')
  })

  test('doit trouver les salons vérifiés', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Strasbourg',
      slug: 'strasbourg',
      postalCode: '67000',
      inseeCode: '67482',
      latitude: 48.5734,
      longitude: 7.7521,
      departmentCode: '67',
      departmentName: 'Bas-Rhin',
      regionCode: '44',
      regionName: 'Grand Est',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    // Create verified salon
    const verifiedSalon = await Salon.create({
      name: 'Strasbourg Verified Tattoo',
      cityId: city.id,
      address: '3 place Kléber',
      postalCode: '67000',
      verificationStatus: SalonVerificationStatus.VERIFIED,
    })

    // Create unverified salon
    await Salon.create({
      name: 'Unverified Salon',
      cityId: city.id,
      address: '15 rue des Grandes Arcades',
      postalCode: '67000',
      verificationStatus: SalonVerificationStatus.UNVERIFIED,
    })

    // Act
    const verifiedSalons = await Salon.findVerified()

    // Assert
    assert.lengthOf(verifiedSalons, 1)
    assert.equal(verifiedSalons[0].id, verifiedSalon.id)
    assert.equal(verifiedSalons[0].name, 'Strasbourg Verified Tattoo')
  })

  test("doit permettre d'ajouter et supprimer des artistes", async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Montpellier',
      slug: 'montpellier',
      postalCode: '34000',
      inseeCode: '34172',
      latitude: 43.6108,
      longitude: 3.8767,
      departmentCode: '34',
      departmentName: 'Hérault',
      regionCode: '76',
      regionName: 'Occitanie',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Montpellier Ink',
      cityId: city.id,
      address: '12 place de la Comédie',
      postalCode: '34000',
    })

    // Create user and artist
    const user = await User.create({
      fullName: 'Marie Dubois',
      email: 'marie.dubois@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true,
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Marie Ink',
      slug: 'marie-ink',
      cityId: city.id,
      experienceLevel: ArtistExperienceLevel.INTERMEDIATE,
      acceptsBookings: true,
      appointmentOnly: true,
      isActive: true,
      isAcceptingNewClients: true,
      currency: 'EUR',
    })

    // Act - Add artist
    await salon.addArtist(artist.id, 'primary')
    await salon.refresh() // Refresh to get updated data

    // Assert
    assert.equal(salon.totalArtists, 1)

    // Act - Remove artist
    await salon.removeArtist(artist.id)
    await salon.refresh()

    // Assert
    assert.equal(salon.totalArtists, 0)
  })

  test('doit effectuer une recherche dans les salons', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Rennes',
      slug: 'rennes',
      postalCode: '35000',
      inseeCode: '35238',
      latitude: 48.1173,
      longitude: -1.6778,
      departmentCode: '35',
      departmentName: 'Ille-et-Vilaine',
      regionCode: '53',
      regionName: 'Bretagne',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    // Create salons with different names and descriptions
    await Salon.create({
      name: 'Rennes Traditional Tattoo',
      description: 'Spécialisé dans le tatouage traditionnel japonais',
      cityId: city.id,
      address: '8 rue Saint-Georges',
      postalCode: '35000',
    })

    await Salon.create({
      name: 'Modern Art Studio',
      description: 'Tatouage moderne et réalisme',
      cityId: city.id,
      address: '15 rue de la Monnaie',
      postalCode: '35000',
    })

    await Salon.create({
      name: 'Celtic Ink',
      description: 'Art celtique et tribal',
      cityId: city.id,
      address: '3 place du Parlement de Bretagne',
      postalCode: '35000',
    })

    // Act
    const traditionalResults = await Salon.search('traditionnel')
    const modernResults = await Salon.search('moderne')
    const addressResults = await Salon.search('Monnaie')

    // Assert
    assert.lengthOf(traditionalResults, 1)
    assert.equal(traditionalResults[0].name, 'Rennes Traditional Tattoo')

    assert.lengthOf(modernResults, 1)
    assert.equal(modernResults[0].name, 'Modern Art Studio')

    assert.lengthOf(addressResults, 1)
    assert.equal(addressResults[0].name, 'Modern Art Studio')
  })

  test('doit gérer les propriétés JSON correctement', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Dijon',
      slug: 'dijon',
      postalCode: '21000',
      inseeCode: '21231',
      latitude: 47.322,
      longitude: 5.0415,
      departmentCode: '21',
      departmentName: "Côte-d'Or",
      regionCode: '27',
      regionName: 'Bourgogne-Franche-Comté',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const services = ['Tatouage traditionnel', 'Tatouage réaliste', 'Piercing']
    const galleryImages = ['image1.jpg', 'image2.jpg', 'image3.jpg']
    const seoKeywords = ['tattoo', 'dijon', 'traditionnel']

    const openingHours = {
      monday: { isOpen: false },
      tuesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '10:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '10:00', closeTime: '19:00' },
      saturday: { isOpen: true, openTime: '09:00', closeTime: '17:00' },
      sunday: { isOpen: false },
    }

    // Act
    const salon = await Salon.create({
      name: 'Dijon Art Tattoo',
      cityId: city.id,
      address: '25 rue de la Liberté',
      postalCode: '21000',
      services,
      galleryImages,
      seoKeywords,
      openingHours,
    })

    // Assert
    assert.deepEqual(salon.services, services)
    assert.deepEqual(salon.galleryImages, galleryImages)
    assert.deepEqual(salon.seoKeywords, seoKeywords)
    assert.deepEqual(salon.openingHours, openingHours)
  })

  test("doit calculer l'adresse complète", async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Clermont-Ferrand',
      slug: 'clermont-ferrand',
      postalCode: '63000',
      inseeCode: '63113',
      latitude: 45.7797,
      longitude: 3.0863,
      departmentCode: '63',
      departmentName: 'Puy-de-Dôme',
      regionCode: '84',
      regionName: 'Auvergne-Rhône-Alpes',
      isActive: true,
      isFeatured: false,
      priority: 0,
    })

    const salon = await Salon.create({
      name: 'Clermont Tattoo',
      cityId: city.id,
      address: '18 place de Jaude',
      postalCode: '63000',
    })

    // Act & Assert
    assert.equal(salon.fullAddress, '18 place de Jaude, 63000')
  })
})

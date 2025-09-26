import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import Artist, { ArtistVerificationStatus, ArtistExperienceLevel } from '#models/artist'
import Salon from '#models/salon'
import City from '#models/city'
import User, { UserRole } from '#models/user'

test.group('Artist Model', (group) => {
  group.each.setup(async () => {
    // Cleanup before each test
    await Artist.query().delete()
    await Salon.query().delete()
    await User.query().delete()
    await City.query().delete()
  })

  test('doit créer un artiste avec les données minimales requises', async ({ assert }) => {
    // Arrange
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Jean Dupont',
      email: 'jean.dupont@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artistData = {
      userId: user.id,
      stageName: 'Johnny Ink',
      cityId: city.id
    }

    // Act
    const artist = await Artist.create(artistData)

    // Assert
    assert.exists(artist.id)
    assert.equal(artist.userId, user.id)
    assert.equal(artist.stageName, 'Johnny Ink')
    assert.equal(artist.slug, 'johnny-ink') // Auto-generated slug
    assert.equal(artist.cityId, city.id)
    assert.equal(artist.experienceLevel, ArtistExperienceLevel.INTERMEDIATE)
    assert.equal(artist.verificationStatus, ArtistVerificationStatus.UNVERIFIED)
    assert.equal(artist.isActive, true)
    assert.equal(artist.acceptsBookings, true)
    assert.equal(artist.appointmentOnly, true)
    assert.equal(artist.isAcceptingNewClients, true)
    assert.equal(artist.isFeatured, false)
    assert.equal(artist.currency, 'EUR')
    assert.equal(artist.totalReviews, 0)
    assert.equal(artist.totalTattoos, 0)
    assert.equal(artist.profileViews, 0)
    assert.equal(artist.hasHealthCertificate, false)
    assert.equal(artist.hasProfessionalInsurance, false)
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Marie Martin',
      email: 'marie.martin@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Act
    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Marie des Arts & Tatouages',
      cityId: city.id
    })

    // Assert
    assert.equal(artist.slug, 'marie-des-arts-and-tatouages')
  })

  test('doit trouver un artiste par son slug', async ({ assert }) => {
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
      regionName: 'Provence-Alpes-Côte d\'Azur',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Pierre Dubois',
      email: 'pierre.dubois@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Pierre Provence',
      slug: 'pierre-provence',
      cityId: city.id
    })

    // Act
    const foundArtist = await Artist.findBySlug('pierre-provence')

    // Assert
    assert.isNotNull(foundArtist)
    assert.equal(foundArtist!.id, artist.id)
    assert.equal(foundArtist!.stageName, 'Pierre Provence')
    assert.equal(foundArtist!.user.fullName, 'Pierre Dubois')
    assert.equal(foundArtist!.city.name, 'Marseille')
  })

  test('doit trouver un artiste par l\'ID utilisateur', async ({ assert }) => {
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Sophie Blanc',
      email: 'sophie.blanc@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Sophie Arts',
      cityId: city.id
    })

    // Act
    const foundArtist = await Artist.findByUserId(user.id)

    // Assert
    assert.isNotNull(foundArtist)
    assert.equal(foundArtist!.id, artist.id)
    assert.equal(foundArtist!.userId, user.id)
  })

  test('doit calculer correctement le prix range formaté', async ({ assert }) => {
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Lucas Noir',
      email: 'lucas.noir@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Lucas Noir',
      cityId: city.id,
      minPrice: 100,
      maxPrice: 500
    })

    // Act & Assert
    assert.equal(artist.priceRange, '100,00 € - 500,00 €')
  })

  test('doit calculer les années d\'expérience automatiquement', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Nice',
      slug: 'nice',
      postalCode: '06000',
      inseeCode: '06088',
      latitude: 43.7102,
      longitude: 7.2620,
      departmentCode: '06',
      departmentName: 'Alpes-Maritimes',
      regionCode: '93',
      regionName: 'Provence-Alpes-Côte d\'Azur',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Emma Rouge',
      email: 'emma.rouge@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Started tattooing 5 years ago
    const startDate = DateTime.now().minus({ years: 5 })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Emma Rouge',
      cityId: city.id,
      startedTattooingAt: startDate
    })

    // Act & Assert
    assert.equal(artist.experienceYears, 5)
  })

  test('doit préférer yearsExperience si défini', async ({ assert }) => {
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Thomas Vert',
      email: 'thomas.vert@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Thomas Vert',
      cityId: city.id,
      yearsExperience: 10,
      startedTattooingAt: DateTime.now().minus({ years: 8 }) // Different value
    })

    // Act & Assert
    assert.equal(artist.experienceYears, 10) // Should use yearsExperience
  })

  test('doit détecter les artistes expérimentés', async ({ assert }) => {
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
      priority: 0
    })

    const user1 = await User.create({
      fullName: 'Expert Artist',
      email: 'expert@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const user2 = await User.create({
      fullName: 'Beginner Artist',
      email: 'beginner@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const expertArtist = await Artist.create({
      userId: user1.id,
      stageName: 'Expert Master',
      cityId: city.id,
      experienceLevel: ArtistExperienceLevel.EXPERT
    })

    const beginnerArtist = await Artist.create({
      userId: user2.id,
      stageName: 'New Artist',
      cityId: city.id,
      experienceLevel: ArtistExperienceLevel.BEGINNER
    })

    // Act & Assert
    assert.isTrue(expertArtist.isExperienced)
    assert.isFalse(beginnerArtist.isExperienced)
  })

  test('doit marquer un artiste comme vérifié', async ({ assert }) => {
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Anna Jaune',
      email: 'anna.jaune@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Anna Jaune',
      cityId: city.id
    })

    // Act
    await artist.markAsVerified('admin@blottr.fr', 'Artiste vérifié par certificats')

    // Assert
    assert.equal(artist.verificationStatus, ArtistVerificationStatus.VERIFIED)
    assert.equal(artist.verifiedBy, 'admin@blottr.fr')
    assert.equal(artist.verificationNotes, 'Artiste vérifié par certificats')
    assert.isNotNull(artist.verifiedAt)
    assert.isTrue(artist.isVerified)
  })

  test('doit trouver les artistes dans une ville', async ({ assert }) => {
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
      priority: 0
    })

    // Create test users
    const user1 = await User.create({
      fullName: 'Featured Artist',
      email: 'featured@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const user2 = await User.create({
      fullName: 'Regular Artist',
      email: 'regular@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const user3 = await User.create({
      fullName: 'Inactive Artist',
      email: 'inactive@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Create artists
    await Artist.create({
      userId: user1.id,
      stageName: 'Featured Master',
      cityId: city.id,
      isFeatured: true,
      priority: 1,
      totalReviews: 50
    })

    await Artist.create({
      userId: user2.id,
      stageName: 'Regular Artist',
      cityId: city.id,
      priority: 2,
      totalReviews: 20
    })

    await Artist.create({
      userId: user3.id,
      stageName: 'Not Accepting',
      cityId: city.id,
      isAcceptingNewClients: false // Should not appear
    })

    // Act
    const artistsInCity = await Artist.findInCity(city.id)

    // Assert
    assert.lengthOf(artistsInCity, 2)
    assert.equal(artistsInCity[0].stageName, 'Featured Master') // Featured first
    assert.equal(artistsInCity[1].stageName, 'Regular Artist')
  })

  test('doit trouver les artistes par style artistique', async ({ assert }) => {
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
      priority: 0
    })

    const user1 = await User.create({
      fullName: 'Traditional Artist',
      email: 'traditional@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const user2 = await User.create({
      fullName: 'Realistic Artist',
      email: 'realistic@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Create artists with different styles
    await Artist.create({
      userId: user1.id,
      stageName: 'Traditional Master',
      cityId: city.id,
      artStyles: ['traditionnel', 'japonais', 'old-school']
    })

    await Artist.create({
      userId: user2.id,
      stageName: 'Realism Expert',
      cityId: city.id,
      artStyles: ['realisme', 'portrait', 'noir-et-blanc']
    })

    // Act
    const traditionalArtists = await Artist.findByArtStyle(['traditionnel'])
    const realisticArtists = await Artist.findByArtStyle(['realisme'])

    // Assert
    assert.lengthOf(traditionalArtists, 1)
    assert.equal(traditionalArtists[0].stageName, 'Traditional Master')

    assert.lengthOf(realisticArtists, 1)
    assert.equal(realisticArtists[0].stageName, 'Realism Expert')
  })

  test('doit effectuer une recherche dans les artistes', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Dijon',
      slug: 'dijon',
      postalCode: '21000',
      inseeCode: '21231',
      latitude: 47.3220,
      longitude: 5.0415,
      departmentCode: '21',
      departmentName: 'Côte-d\'Or',
      regionCode: '27',
      regionName: 'Bourgogne-Franche-Comté',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user1 = await User.create({
      fullName: 'Dragon Artist',
      email: 'dragon@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const user2 = await User.create({
      fullName: 'Flower Artist',
      email: 'flower@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Create artists with searchable content
    await Artist.create({
      userId: user1.id,
      stageName: 'Dragon Master',
      bio: 'Spécialisé dans les dragons asiatiques et la mythologie',
      specialty: 'Dragons et créatures fantastiques',
      cityId: city.id
    })

    await Artist.create({
      userId: user2.id,
      stageName: 'Flower Power',
      bio: 'Art floral et tatouages botaniques',
      specialty: 'Fleurs et motifs végétaux',
      cityId: city.id
    })

    // Act
    const dragonResults = await Artist.search('dragon')
    const flowerResults = await Artist.search('floral')
    const nameResults = await Artist.search('Power')

    // Assert
    assert.lengthOf(dragonResults, 1)
    assert.equal(dragonResults[0].stageName, 'Dragon Master')

    assert.lengthOf(flowerResults, 1)
    assert.equal(flowerResults[0].stageName, 'Flower Power')

    assert.lengthOf(nameResults, 1)
    assert.equal(nameResults[0].stageName, 'Flower Power')
  })

  test('doit gérer les relations avec les salons', async ({ assert }) => {
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
      priority: 0
    })

    const user = await User.create({
      fullName: 'Mobile Artist',
      email: 'mobile@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Mobile Tattoo',
      cityId: city.id
    })

    const salon1 = await Salon.create({
      name: 'Primary Salon',
      cityId: city.id,
      address: '1 rue Principale',
      postalCode: '63000'
    })

    const salon2 = await Salon.create({
      name: 'Guest Salon',
      cityId: city.id,
      address: '2 rue Secondaire',
      postalCode: '63000'
    })

    // Act - Add to salons
    await artist.addToSalon(salon1.id, 'primary')
    await artist.addToSalon(salon2.id, 'guest')

    // Refresh to get updated data
    await artist.refresh()

    // Assert
    assert.equal(artist.primarySalonId, salon1.id)

    // Act - Set different primary salon
    await artist.setPrimarySalon(salon2.id)

    // Assert
    assert.equal(artist.primarySalonId, salon2.id)

    // Act - Remove from salon
    await artist.removeFromSalon(salon2.id)
    await artist.refresh()

    // Assert
    assert.isNull(artist.primarySalonId)
  })

  test('doit vérifier le profil complet', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Le Havre',
      slug: 'le-havre',
      postalCode: '76600',
      inseeCode: '76351',
      latitude: 49.4944,
      longitude: 0.1079,
      departmentCode: '76',
      departmentName: 'Seine-Maritime',
      regionCode: '28',
      regionName: 'Normandie',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Complete Artist',
      email: 'complete@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Create incomplete artist
    const incompleteArtist = await Artist.create({
      userId: user.id,
      stageName: 'Incomplete',
      cityId: city.id
    })

    // Create complete artist
    const completeArtist = await Artist.create({
      userId: user.id,
      stageName: 'Complete Master',
      bio: 'Expert tatoueur avec 10 ans d\'expérience',
      specialty: 'Réalisme et portraits',
      artStyles: ['realisme', 'portrait'],
      minPrice: 150,
      portfolioImages: ['image1.jpg', 'image2.jpg', 'image3.jpg'],
      cityId: city.id
    })

    // Act & Assert
    assert.isFalse(incompleteArtist.isProfileComplete)
    assert.isTrue(completeArtist.isProfileComplete)
  })

  test('doit gérer les certifications de santé', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Amiens',
      slug: 'amiens',
      postalCode: '80000',
      inseeCode: '80021',
      latitude: 49.8941,
      longitude: 2.2958,
      departmentCode: '80',
      departmentName: 'Somme',
      regionCode: '32',
      regionName: 'Hauts-de-France',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Health Certified',
      email: 'health@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    // Create artist with health credentials
    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Health Master',
      cityId: city.id,
      hasHealthCertificate: true,
      hasProfessionalInsurance: true,
      healthCertificateExpiresAt: DateTime.now().plus({ years: 1 }) // Valid for 1 year
    })

    // Act & Assert
    assert.isTrue(artist.hasHealthCredentials)
  })

  test('doit incrémenter les vues de profil', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Poitiers',
      slug: 'poitiers',
      postalCode: '86000',
      inseeCode: '86194',
      latitude: 46.5802,
      longitude: 0.3404,
      departmentCode: '86',
      departmentName: 'Vienne',
      regionCode: '75',
      regionName: 'Nouvelle-Aquitaine',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Popular Artist',
      email: 'popular@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Popular',
      cityId: city.id,
      profileViews: 10
    })

    // Act
    await artist.incrementProfileViews()

    // Assert
    assert.equal(artist.profileViews, 11)
  })

  test('doit mettre à jour la dernière activité', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Caen',
      slug: 'caen',
      postalCode: '14000',
      inseeCode: '14118',
      latitude: 49.1829,
      longitude: -0.3707,
      departmentCode: '14',
      departmentName: 'Calvados',
      regionCode: '28',
      regionName: 'Normandie',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'Active Artist',
      email: 'active@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artist = await Artist.create({
      userId: user.id,
      stageName: 'Active',
      cityId: city.id
    })

    const beforeUpdate = artist.lastActivityAt

    // Act
    await artist.updateLastActivity()

    // Assert
    assert.isNotNull(artist.lastActivityAt)
    if (beforeUpdate) {
      assert.isTrue(artist.lastActivityAt! > beforeUpdate)
    }
  })

  test('doit gérer les propriétés JSON correctement', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Brest',
      slug: 'brest',
      postalCode: '29200',
      inseeCode: '29019',
      latitude: 48.3905,
      longitude: -4.4861,
      departmentCode: '29',
      departmentName: 'Finistère',
      regionCode: '53',
      regionName: 'Bretagne',
      isActive: true,
      isFeatured: false,
      priority: 0
    })

    const user = await User.create({
      fullName: 'JSON Artist',
      email: 'json@example.com',
      password: 'password123',
      role: UserRole.ARTIST,
      cityId: city.id,
      emailVerified: true,
      phoneVerified: true,
      isActive: true
    })

    const artStyles = ['traditionnel', 'japonais', 'geometrique']
    const portfolioImages = ['portfolio1.jpg', 'portfolio2.jpg', 'portfolio3.jpg']
    const socialLinks = {
      instagram: 'https://instagram.com/artist',
      facebook: 'https://facebook.com/artist',
      website: 'https://artist.com'
    }
    const seoKeywords = ['tattoo', 'brest', 'traditionnel']
    const availability = {
      monday: { isAvailable: false },
      tuesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      thursday: { isAvailable: true, startTime: '09:00', endTime: '17:00' },
      friday: { isAvailable: true, startTime: '09:00', endTime: '18:00' },
      saturday: { isAvailable: true, startTime: '10:00', endTime: '16:00' },
      sunday: { isAvailable: false }
    }

    // Act
    const artist = await Artist.create({
      userId: user.id,
      stageName: 'JSON Master',
      cityId: city.id,
      artStyles,
      portfolioImages,
      socialLinks,
      seoKeywords,
      availability
    })

    // Assert
    assert.deepEqual(artist.artStyles, artStyles)
    assert.deepEqual(artist.portfolioImages, portfolioImages)
    assert.deepEqual(artist.socialLinks, socialLinks)
    assert.deepEqual(artist.seoKeywords, seoKeywords)
    assert.deepEqual(artist.availability, availability)
  })
})
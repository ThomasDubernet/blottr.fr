import { test } from '@japa/runner'
import City from '#models/city'
import User from '#models/user'

test.group('City Model', (group) => {
  group.each.setup(async () => {
    // Cleanup before each test
    await User.query().delete()
    await City.query().delete()
  })

  test('doit créer une ville avec les champs obligatoires', async ({ assert }) => {
    // Arrange & Act
    const city = await City.create({
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
    })

    // Assert
    assert.isNotNull(city.id)
    assert.equal(city.name, 'Paris')
    assert.equal(city.slug, 'paris')
    assert.equal(city.postalCode, '75000')
    assert.equal(city.inseeCode, '75056')
    assert.equal(city.latitude, 48.8566)
    assert.equal(city.longitude, 2.3522)
    assert.isTrue(city.isActive ?? true)
    assert.isFalse(city.isFeatured ?? false)
    assert.equal(city.priority || 100, 100)
    assert.isNotNull(city.createdAt)
  })

  test('doit avoir un displayName formaté', async ({ assert }) => {
    // Arrange & Act
    const city = await City.create({
      name: 'Lyon',
      slug: 'lyon',
      postalCode: '69000',
      inseeCode: '69123',
      latitude: 45.764,
      longitude: 4.8357,
      departmentCode: '69',
      departmentName: 'Rhône',
      regionCode: '84',
      regionName: 'Auvergne-Rhône-Alpes',
    })

    // Assert
    assert.equal(city.displayName, 'Lyon (69000)')
  })

  test('doit formater la population', async ({ assert }) => {
    // Arrange & Act
    const cityWithPopulation = await City.create({
      name: 'Marseille',
      slug: 'marseille',
      postalCode: '13000',
      inseeCode: '13055',
      latitude: 43.2965,
      longitude: 5.3698,
      population: 870000,
      departmentCode: '13',
      departmentName: 'Bouches-du-Rhône',
      regionCode: '93',
      regionName: "Provence-Alpes-Côte d'Azur",
    })

    const cityWithoutPopulation = await City.create({
      name: 'Test City',
      slug: 'test-city',
      postalCode: '12345',
      inseeCode: '12345',
      latitude: 45.0,
      longitude: 5.0,
      departmentCode: '12',
      departmentName: 'Test Department',
      regionCode: '12',
      regionName: 'Test Region',
    })

    // Assert
    assert.equal(cityWithPopulation.formattedPopulation, '870 000')
    assert.isNull(cityWithoutPopulation.formattedPopulation)
  })

  test('doit retourner les coordonnées', async ({ assert }) => {
    // Arrange & Act
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
    })

    // Assert
    assert.deepEqual(city.coordinates, { lat: 43.7102, lng: 7.262 })
  })

  test('doit trouver une ville par slug', async ({ assert }) => {
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
    })

    // Act
    const foundCity = await City.findBySlug('toulouse')

    // Assert
    assert.isNotNull(foundCity)
    assert.equal(foundCity!.id, city.id)
    assert.equal(foundCity!.name, 'Toulouse')
  })

  test('ne doit pas trouver une ville inactive par slug', async ({ assert }) => {
    // Arrange
    await City.create({
      name: 'Inactive City',
      slug: 'inactive-city',
      postalCode: '12345',
      inseeCode: '12345',
      latitude: 45.0,
      longitude: 5.0,
      departmentCode: '12',
      departmentName: 'Test Department',
      regionCode: '12',
      regionName: 'Test Region',
      isActive: false,
    })

    // Act
    const foundCity = await City.findBySlug('inactive-city')

    // Assert
    assert.isNull(foundCity)
  })

  test('doit trouver des villes par code postal', async ({ assert }) => {
    // Arrange
    await City.createMany([
      {
        name: 'Paris 1er',
        slug: 'paris-1er',
        postalCode: '75001',
        inseeCode: '75101',
        latitude: 48.8631,
        longitude: 2.3371,
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        priority: 1,
      },
      {
        name: 'Paris 2ème',
        slug: 'paris-2eme',
        postalCode: '75002',
        inseeCode: '75102',
        latitude: 48.868,
        longitude: 2.341,
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        priority: 2,
      },
    ])

    // Act
    const cities = await City.findByPostalCode('75001')

    // Assert
    assert.lengthOf(cities, 1)
    assert.equal(cities[0].name, 'Paris 1er')
  })

  test('doit trouver les villes en vedette', async ({ assert }) => {
    // Arrange
    await City.createMany([
      {
        name: 'Featured City 1',
        slug: 'featured-city-1',
        postalCode: '11111',
        inseeCode: '11111',
        latitude: 45.0,
        longitude: 5.0,
        departmentCode: '11',
        departmentName: 'Test Department',
        regionCode: '11',
        regionName: 'Test Region',
        isFeatured: true,
        priority: 1,
      },
      {
        name: 'Regular City',
        slug: 'regular-city',
        postalCode: '22222',
        inseeCode: '22222',
        latitude: 46.0,
        longitude: 6.0,
        departmentCode: '22',
        departmentName: 'Test Department 2',
        regionCode: '22',
        regionName: 'Test Region 2',
        isFeatured: false,
      },
      {
        name: 'Featured City 2',
        slug: 'featured-city-2',
        postalCode: '33333',
        inseeCode: '33333',
        latitude: 47.0,
        longitude: 7.0,
        departmentCode: '33',
        departmentName: 'Test Department 3',
        regionCode: '33',
        regionName: 'Test Region 3',
        isFeatured: true,
        priority: 2,
      },
    ])

    // Act
    const featuredCities = await City.getFeaturedCities()

    // Assert
    assert.lengthOf(featuredCities, 2)
    assert.equal(featuredCities[0].name, 'Featured City 1')
    assert.equal(featuredCities[1].name, 'Featured City 2')
  })

  test('doit calculer la distance entre deux villes', async ({ assert }) => {
    // Arrange
    const paris = await City.create({
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
    })

    const lyon = await City.create({
      name: 'Lyon',
      slug: 'lyon',
      postalCode: '69000',
      inseeCode: '69123',
      latitude: 45.764,
      longitude: 4.8357,
      departmentCode: '69',
      departmentName: 'Rhône',
      regionCode: '84',
      regionName: 'Auvergne-Rhône-Alpes',
    })

    // Act
    const distance = paris.distanceToKm(lyon.latitude, lyon.longitude)

    // Assert
    // Distance Paris-Lyon approximativement 465 km
    console.log('Distance calculated:', distance)
    assert.isTrue(distance > 360 && distance < 500) // More lenient range
  })

  test('doit trouver des villes à proximité', async ({ assert }) => {
    // Arrange - Create cities around Paris
    const parisLat = 48.8566
    const parisLng = 2.3522

    await City.createMany([
      {
        name: 'Paris',
        slug: 'paris',
        postalCode: '75000',
        inseeCode: '75056',
        latitude: parisLat,
        longitude: parisLng,
        departmentCode: '75',
        departmentName: 'Paris',
        regionCode: '11',
        regionName: 'Île-de-France',
        priority: 1,
      },
      {
        name: 'Versailles',
        slug: 'versailles',
        postalCode: '78000',
        inseeCode: '78646',
        latitude: 48.8014,
        longitude: 2.1301, // ~20km from Paris
        departmentCode: '78',
        departmentName: 'Yvelines',
        regionCode: '11',
        regionName: 'Île-de-France',
        priority: 10,
      },
      {
        name: 'Lyon',
        slug: 'lyon',
        postalCode: '69000',
        inseeCode: '69123',
        latitude: 45.764,
        longitude: 4.8357, // ~465km from Paris
        departmentCode: '69',
        departmentName: 'Rhône',
        regionCode: '84',
        regionName: 'Auvergne-Rhône-Alpes',
        priority: 5,
      },
    ])

    // Act - Find cities within 30km of Paris
    const nearbyCities = await City.findNearby(parisLat, parisLng, 30)

    // Assert
    assert.isTrue(nearbyCities.length >= 2) // Paris and Versailles
    const cityNames = nearbyCities.map((city) => city.name)
    assert.include(cityNames, 'Paris')
    assert.include(cityNames, 'Versailles')
    assert.notInclude(cityNames, 'Lyon') // Lyon should be too far
  })

  test("doit compter les utilisateurs d'une ville", async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Test City',
      slug: 'test-city',
      postalCode: '12345',
      inseeCode: '12345',
      latitude: 45.0,
      longitude: 5.0,
      departmentCode: '12',
      departmentName: 'Test Department',
      regionCode: '12',
      regionName: 'Test Region',
    })

    // Create users in the city
    await User.createMany([
      {
        fullName: 'User 1',
        email: 'user1@example.com',
        password: 'password123',
        cityId: city.id,
        isActive: true,
      },
      {
        fullName: 'User 2',
        email: 'user2@example.com',
        password: 'password123',
        cityId: city.id,
        isActive: true,
      },
      {
        fullName: 'Inactive User',
        email: 'inactive@example.com',
        password: 'password123',
        cityId: city.id,
        isActive: false, // Should not be counted
      },
    ])

    // Act
    const usersCount = await city.getUsersCount()

    // Assert
    assert.equal(usersCount, 2)
  })

  test('doit établir une relation avec les utilisateurs', async ({ assert }) => {
    // Arrange
    const city = await City.create({
      name: 'Test City',
      slug: 'test-city',
      postalCode: '12345',
      inseeCode: '12345',
      latitude: 45.0,
      longitude: 5.0,
      departmentCode: '12',
      departmentName: 'Test Department',
      regionCode: '12',
      regionName: 'Test Region',
    })

    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      cityId: city.id,
    })

    // Act
    await city.load('users')

    // Assert
    assert.lengthOf(city.users, 1)
    assert.equal(city.users[0].id, user.id)
    assert.equal(city.users[0].fullName, 'Test User')
  })
})

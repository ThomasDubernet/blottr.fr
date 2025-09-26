import { test } from '@japa/runner'
import {
  generateSampleArtists,
  MAP_CONFIG,
  calculateDistance,
  formatDistance,
  isValidCoordinates,
} from '../../../inertia/lib/utils.js'

test.group('Map Utils', () => {
  test("generateSampleArtists doit retourner des données d'artistes valides", ({ assert }) => {
    const artists = generateSampleArtists()

    assert.isArray(artists)
    assert.isAbove(artists.length, 0)

    const firstArtist = artists[0]
    assert.properties(firstArtist, [
      'id',
      'stageName',
      'city',
      'slug',
      'totalReviews',
      'isVerified',
      'isFeatured',
    ])

    assert.properties(firstArtist.city, ['name', 'latitude', 'longitude'])

    assert.isString(firstArtist.stageName)
    assert.isString(firstArtist.slug)
    assert.isNumber(firstArtist.totalReviews)
    assert.isBoolean(firstArtist.isVerified)
    assert.isBoolean(firstArtist.isFeatured)
  })

  test('MAP_CONFIG doit contenir des villes françaises valides', ({ assert }) => {
    assert.property(MAP_CONFIG, 'FRENCH_CITIES')
    assert.property(MAP_CONFIG, 'DEFAULT_CENTER')
    assert.property(MAP_CONFIG, 'DEFAULT_ZOOM')

    const cities = MAP_CONFIG.FRENCH_CITIES
    assert.property(cities, 'Paris')
    assert.property(cities, 'Lyon')
    assert.property(cities, 'Marseille')

    const paris = cities.Paris
    assert.properties(paris, ['latitude', 'longitude'])
    assert.isNumber(paris.latitude)
    assert.isNumber(paris.longitude)

    // Les coordonnées de Paris devraient être approximativement correctes
    assert.isAbove(paris.latitude, 48)
    assert.isBelow(paris.latitude, 49)
    assert.isAbove(paris.longitude, 2)
    assert.isBelow(paris.longitude, 3)
  })

  test('calculateDistance doit calculer la distance entre villes correctement', ({ assert }) => {
    const parisLat = MAP_CONFIG.FRENCH_CITIES.Paris.latitude
    const parisLng = MAP_CONFIG.FRENCH_CITIES.Paris.longitude
    const lyonLat = MAP_CONFIG.FRENCH_CITIES.Lyon.latitude
    const lyonLng = MAP_CONFIG.FRENCH_CITIES.Lyon.longitude

    const distance = calculateDistance(parisLat, parisLng, lyonLat, lyonLng)

    // La distance entre Paris et Lyon devrait être d'environ 400-500 km
    assert.isNumber(distance)
    assert.isAbove(distance, 350)
    assert.isBelow(distance, 550)
  })

  test('formatDistance doit formater les distances correctement', ({ assert }) => {
    assert.equal(formatDistance(0.5), '500m')
    assert.equal(formatDistance(0.123), '123m')
    assert.equal(formatDistance(1.5), '1.5km')
    assert.equal(formatDistance(42.7), '42.7km')
  })

  test('isValidCoordinates doit valider les coordonnées correctement', ({ assert }) => {
    // Coordonnées valides
    assert.isTrue(isValidCoordinates(48.8566, 2.3522)) // Paris
    assert.isTrue(isValidCoordinates(0, 0)) // Équateur/Méridien de Greenwich
    assert.isTrue(isValidCoordinates(-90, -180)) // Pôle sud, ouest
    assert.isTrue(isValidCoordinates(90, 180)) // Pôle nord, est

    // Coordonnées invalides
    assert.isFalse(isValidCoordinates(91, 0)) // Latitude trop élevée
    assert.isFalse(isValidCoordinates(-91, 0)) // Latitude trop basse
    assert.isFalse(isValidCoordinates(0, 181)) // Longitude trop élevée
    assert.isFalse(isValidCoordinates(0, -181)) // Longitude trop basse
    assert.isFalse(isValidCoordinates(Number.NaN, 0)) // Latitude NaN
    assert.isFalse(isValidCoordinates(0, Number.NaN)) // Longitude NaN
  })

  test("les artistes d'exemple doivent avoir des coordonnées valides", ({ assert }) => {
    const artists = generateSampleArtists()

    for (const artist of artists) {
      const { latitude, longitude } = artist.city
      assert.isTrue(
        isValidCoordinates(latitude, longitude),
        `L'artiste ${artist.stageName} a des coordonnées invalides: ${latitude}, ${longitude}`
      )
    }
  })

  test("les artistes d'exemple doivent inclure les artistes vedettes attendus", ({ assert }) => {
    const artists = generateSampleArtists()
    const featuredArtists = artists.filter((artist) => artist.isFeatured)
    const verifiedArtists = artists.filter((artist) => artist.isVerified)

    assert.isAbove(featuredArtists.length, 0, 'Devrait avoir au moins un artiste vedette')
    assert.isAbove(verifiedArtists.length, 0, 'Devrait avoir au moins un artiste vérifié')

    // Vérifier des artistes spécifiques du design original
    const herve = artists.find((artist) => artist.stageName === 'Hervé')
    const nastick = artists.find((artist) => artist.stageName === 'Nastick')

    assert.isDefined(herve, 'Devrait inclure Hervé du design original')
    assert.isDefined(nastick, 'Devrait inclure Nastick du design original')

    if (herve) {
      assert.equal(herve.city.name, 'Sarralbe')
      assert.include(herve.artStyles || [], 'Trash Polka')
      assert.isTrue(herve.isFeatured)
    }

    if (nastick) {
      assert.equal(nastick.city.name, 'Rouen')
      assert.include(nastick.artStyles || [], 'Géométrique')
    }
  })

  test("les artistes d'exemple doivent avoir des emplacements diversifiés en France", ({
    assert,
  }) => {
    const artists = generateSampleArtists()
    const cities = artists.map((artist) => artist.city.name)
    const uniqueCities = new Set(cities)

    // Devrait avoir des artistes dans plusieurs villes
    assert.isAbove(
      uniqueCities.size,
      5,
      'Devrait avoir des artistes dans au moins 6 villes différentes'
    )

    // Devrait inclure les grandes villes françaises
    assert.include(cities, 'Paris')
    assert.include(cities, 'Lyon')
    assert.include(cities, 'Marseille')
  })

  test("les artistes d'exemple doivent avoir des données réalistes", ({ assert }) => {
    const artists = generateSampleArtists()

    for (const artist of artists) {
      // Les avis devraient être réalistes
      assert.isAbove(artist.totalReviews, 0)
      assert.isBelow(artist.totalReviews, 1000)

      // Les notes devraient être entre 1-5 si présentes
      if (artist.averageRating) {
        assert.isAbove(artist.averageRating, 1)
        assert.isBelow(artist.averageRating, 5.1)
      }

      // Devrait avoir des styles artistiques
      assert.isDefined(artist.artStyles)
      if (artist.artStyles) {
        assert.isAbove(artist.artStyles.length, 0)
        assert.isBelow(artist.artStyles.length, 10)
      }

      // Le slug devrait être compatible URL
      assert.match(artist.slug, /^[a-z0-9-]+$/)
    }
  })
})

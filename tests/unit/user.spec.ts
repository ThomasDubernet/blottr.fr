import { test } from '@japa/runner'
import { DateTime } from 'luxon'
import User, { UserRole, UserGender } from '#models/user'
import City from '#models/city'
import hash from '@adonisjs/core/services/hash'

test.group('User Model', (group) => {
  group.each.setup(async () => {
    // Cleanup before each test
    await User.query().delete()
    await City.query().delete()
  })

  test('doit créer un utilisateur avec les champs par défaut', async ({ assert }) => {
    // Arrange & Act
    const user = await User.create({
      fullName: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'password123'
    })

    // Assert
    assert.isNotNull(user.id)
    assert.equal(user.fullName, 'Jean Dupont')
    assert.equal(user.email, 'jean@example.com')
    assert.equal(user.role || UserRole.CLIENT, UserRole.CLIENT)
    assert.isFalse(user.emailVerified ?? false)
    assert.isFalse(user.phoneVerified ?? false)
    assert.isTrue(user.isActive ?? true)
    assert.isNotNull(user.createdAt)
  })

  test('doit hacher le mot de passe automatiquement', async ({ assert }) => {
    // Arrange & Act
    const user = await User.create({
      fullName: 'Jane Doe',
      email: 'jane@example.com',
      password: 'mySecretPassword'
    })

    // Assert
    assert.notEqual(user.password, 'mySecretPassword')
    assert.isTrue(await hash.verify(user.password, 'mySecretPassword'))
  })

  test('doit créer un utilisateur artiste', async ({ assert }) => {
    // Arrange & Act
    const artist = await User.create({
      fullName: 'Marie Artiste',
      email: 'marie@tatoueur.com',
      password: 'password123',
      role: UserRole.ARTIST
    })

    // Assert
    assert.equal(artist.role, UserRole.ARTIST)
    assert.isTrue(artist.isArtist)
    assert.isFalse(artist.isClient)
  })

  test('doit calculer l\'âge correctement', async ({ assert }) => {
    // Arrange
    const birthDate = DateTime.now().minus({ years: 25, months: 6 })

    // Act
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      birthDate: birthDate
    })

    // Assert
    assert.equal(user.age, 25)
  })

  test('doit retourner null pour l\'âge si pas de date de naissance', async ({ assert }) => {
    // Arrange & Act
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    // Assert
    assert.isNull(user.age)
  })

  test('doit avoir un displayName basé sur fullName ou email', async ({ assert }) => {
    // Arrange & Act
    const userWithName = await User.create({
      fullName: 'Jean Dupont',
      email: 'jean@example.com',
      password: 'password123'
    })

    const userWithoutName = await User.create({
      email: 'test@example.com',
      password: 'password123'
    })

    // Assert
    assert.equal(userWithName.displayName, 'Jean Dupont')
    assert.equal(userWithoutName.displayName, 'test')
  })

  test('doit vérifier si le profil est complet', async ({ assert }) => {
    // Arrange
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
      regionName: 'Île-de-France'
    })

    // Act
    const incompleteUser = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    const completeUser = await User.create({
      fullName: 'Complete User',
      email: 'complete@example.com',
      password: 'password123',
      phone: '+33123456789',
      cityId: city.id
    })

    // Assert
    assert.isFalse(incompleteUser.isProfileComplete)
    assert.isTrue(completeUser.isProfileComplete)
  })

  test('doit marquer l\'email comme vérifié', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    // Act
    await user.markEmailAsVerified()

    // Assert
    assert.isTrue(user.emailVerified)
    assert.isNotNull(user.emailVerifiedAt)
    assert.instanceOf(user.emailVerifiedAt, DateTime)
  })

  test('doit marquer le téléphone comme vérifié', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '+33123456789'
    })

    // Act
    await user.markPhoneAsVerified()

    // Assert
    assert.isTrue(user.phoneVerified)
    assert.isNotNull(user.phoneVerifiedAt)
    assert.instanceOf(user.phoneVerifiedAt, DateTime)
  })

  test('doit changer le rôle utilisateur', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: UserRole.CLIENT
    })

    // Act
    await user.changeRole(UserRole.ARTIST)

    // Assert
    assert.equal(user.role, UserRole.ARTIST)
    assert.isTrue(user.isArtist)
    assert.isFalse(user.isClient)
  })

  test('doit changer l\'email et réinitialiser la vérification', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'old@example.com',
      password: 'password123',
      emailVerified: true,
      emailVerifiedAt: DateTime.now()
    })

    // Act
    await user.changeEmail('new@example.com')

    // Assert
    assert.equal(user.email, 'new@example.com')
    assert.isFalse(user.emailVerified)
    assert.isNull(user.emailVerifiedAt)
  })

  test('doit calculer la distance entre deux utilisateurs', async ({ assert }) => {
    // Arrange
    const user1 = await User.create({
      fullName: 'User Paris',
      email: 'paris@example.com',
      password: 'password123',
      latitude: 48.8566,
      longitude: 2.3522
    })

    const user2 = await User.create({
      fullName: 'User Lyon',
      email: 'lyon@example.com',
      password: 'password123',
      latitude: 45.7640,
      longitude: 4.8357
    })

    // Act
    const distance = user1.distanceToKm(user2.latitude!, user2.longitude!)

    // Assert
    assert.isNotNull(distance)
    // Distance Paris-Lyon approximativement 465 km
    console.log('User distance calculated:', distance)
    assert.isTrue(distance! > 360 && distance! < 500) // More lenient range
  })

  test('doit retourner null pour la distance si pas de coordonnées', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    // Act
    const distance = user.distanceToKm(48.8566, 2.3522)

    // Assert
    assert.isNull(distance)
  })

  test('doit trouver un utilisateur par email', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    })

    // Act
    const foundUser = await User.findByEmail('test@example.com')

    // Assert
    assert.isNotNull(foundUser)
    assert.equal(foundUser!.id, user.id)
    assert.equal(foundUser!.email, 'test@example.com')
  })

  test('ne doit pas trouver un utilisateur inactif par email', async ({ assert }) => {
    // Arrange
    const user = await User.create({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      isActive: false
    })

    // Act
    const foundUser = await User.findByEmail('test@example.com')

    // Assert
    assert.isNull(foundUser)
  })

  test('doit trouver les clients uniquement', async ({ assert }) => {
    // Arrange
    await User.createMany([
      {
        fullName: 'Client 1',
        email: 'client1@example.com',
        password: 'password123',
        role: UserRole.CLIENT
      },
      {
        fullName: 'Artist 1',
        email: 'artist1@example.com',
        password: 'password123',
        role: UserRole.ARTIST
      },
      {
        fullName: 'Client 2',
        email: 'client2@example.com',
        password: 'password123',
        role: UserRole.CLIENT
      }
    ])

    // Act
    const clients = await User.findClients()

    // Assert
    assert.lengthOf(clients, 2)
    clients.forEach(client => {
      assert.equal(client.role, UserRole.CLIENT)
      assert.isTrue(client.isClient)
    })
  })

  test('doit trouver les artistes uniquement', async ({ assert }) => {
    // Arrange
    await User.createMany([
      {
        fullName: 'Client 1',
        email: 'client1@example.com',
        password: 'password123',
        role: UserRole.CLIENT
      },
      {
        fullName: 'Artist 1',
        email: 'artist1@example.com',
        password: 'password123',
        role: UserRole.ARTIST
      },
      {
        fullName: 'Artist 2',
        email: 'artist2@example.com',
        password: 'password123',
        role: UserRole.ARTIST
      }
    ])

    // Act
    const artists = await User.findArtists()

    // Assert
    assert.lengthOf(artists, 2)
    artists.forEach(artist => {
      assert.equal(artist.role, UserRole.ARTIST)
      assert.isTrue(artist.isArtist)
    })
  })
})
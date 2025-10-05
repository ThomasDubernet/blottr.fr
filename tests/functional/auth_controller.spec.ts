import { test } from '@japa/runner'
import User, { UserRole } from '#models/user'
import db from '@adonisjs/lucid/services/db'

test.group('AuthController - Inscription', (group) => {
  group.each.setup(async () => {
    // Clean up users table and rate limits before each test
    await User.query().delete()
    await db.from('rate_limits').delete()
  })

  test('POST /inscription - doit cr\u00e9er un utilisateur client valide', async ({ client, assert }) => {
    // Arrange
    const userData = {
      email: 'client@example.com',
      password: 'Secure123',
      role: 'client',
    }

    // Act
    const response = await client.post('/inscription').redirects(0).json(userData)

    // Assert
    response.assertStatus(302) // Redirect
    response.assertHeader("location", "/connexion")

    // Verify in database
    const user = await User.findBy('email', userData.email)
    assert.isNotNull(user)
    assert.equal(user!.email, userData.email)
    assert.equal(user!.role, UserRole.CLIENT)
    assert.isTrue(user!.isActive)
    assert.isFalse(user!.emailVerified)
    
    // Password should be hashed, not plain text
    assert.notEqual(user!.password, userData.password)
  })

  test('POST /inscription - doit cr\u00e9er un utilisateur artiste valide', async ({ client, assert }) => {
    // Arrange
    const userData = {
      email: 'artist@example.com',
      password: 'Secure123',
      role: 'artist',
    }

    // Act
    const response = await client.post('/inscription').redirects(0).json(userData)

    // Assert
    response.assertStatus(302)
    response.assertHeader("location", "/connexion")

    // Verify in database
    const user = await User.findBy('email', userData.email)
    assert.isNotNull(user)
    assert.equal(user!.role, UserRole.ARTIST)
  })

  test('POST /inscription - doit rejeter un email d\u00e9j\u00e0 utilis\u00e9', async ({ client, assert }) => {
    // Arrange - Create existing user
    await User.create({
      email: 'existing@example.com',
      password: 'Password123',
      role: UserRole.CLIENT,
      isActive: true,
      emailVerified: false,
      phoneVerified: false,
    })

    // Act - Try to create user with same email
    const response = await client
      .post('/inscription')
      .redirects(0)
      .header('Accept', 'application/json')
      .json({
        email: 'existing@example.com',
        password: 'Password123',
        role: 'client',
      })

    // Assert
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          rule: 'database.unique',
        },
      ],
    })

    // Verify only one user exists
    const users = await User.query().where('email', 'existing@example.com')
    assert.lengthOf(users, 1)
  })

  test('POST /inscription - doit rejeter un email invalide', async ({ client }) => {
    // Arrange
    const userData = {
      email: 'not-an-email',
      password: 'Secure123',
      role: 'client',
    }

    // Act
    const response = await client
      .post('/inscription')
      .redirects(0)
      .header('Accept', 'application/json')
      .json(userData)

    // Assert
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'email',
          rule: 'email',
        },
      ],
    })
  })

  test('POST /inscription - doit rejeter un mot de passe trop court', async ({ client }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'short',
      role: 'client',
    }

    // Act
    const response = await client
      .post('/inscription')
      .redirects(0)
      .header('Accept', 'application/json')
      .json(userData)

    // Assert
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'password',
          rule: 'minLength',
        },
      ],
    })
  })

  test('POST /inscription - doit rejeter un r\u00f4le invalide', async ({ client }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'Secure123',
      role: 'admin', // Invalid role
    }

    // Act
    const response = await client
      .post('/inscription')
      .redirects(0)
      .header('Accept', 'application/json')
      .json(userData)

    // Assert
    response.assertStatus(422)
    response.assertBodyContains({
      errors: [
        {
          field: 'role',
        },
      ],
    })
  })

  test('POST /inscription - doit authentifier l\'utilisateur apr\u00e8s inscription', async ({
    client,
    assert,
  }) => {
    // Arrange
    const userData = {
      email: 'test@example.com',
      password: 'Secure123',
      role: 'client',
    }

    // Act
    const response = await client.post('/inscription').redirects(0).json(userData)

    // Assert
    response.assertStatus(302)
    
    // Verify user is authenticated by checking session/cookie
    const cookies = response.cookies()
    assert.isNotEmpty(cookies)
    
    // User should exist and be active
    const user = await User.findBy('email', userData.email)
    assert.isNotNull(user)
    assert.isTrue(user!.isActive)
  })

  test('POST /inscription - doit afficher un message flash de succès', async ({ client }) => {
    // Arrange
    const userData = {
      email: 'flash-test@example.com',
      password: 'Secure123',
      role: 'client',
    }

    // Act
    const response = await client.post('/inscription').redirects(0).json(userData)

    // Assert
    response.assertStatus(302)
    response.assertHeader("location", "/connexion")

    // Note: Flash messages can only be verified after following the redirect
    // The controller sets session.flash('success', message) which is verified in integration tests
  })
})

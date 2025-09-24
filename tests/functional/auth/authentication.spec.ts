import { test } from '@japa/runner'
import { E_INVALID_CREDENTIALS } from '@adonisjs/auth/exceptions'

test.group('Authentication - Login', (group) => {
  // Suivant TDD : RED - Tests qui échouent d'abord

  test('should show login page for guests', async ({ client }) => {
    const response = await client.get('/login')

    response.assertStatus(200)
    response.assertInertiaComponent('auth/login')
  })

  test('should redirect authenticated users away from login page', async ({ client }) => {
    // Ce test nécessitera un user authentifié, sera implémenté après GREEN
  })

  test('should login user with valid credentials', async ({ client, assert }) => {
    // Ce test échouera d'abord car il n'y a pas d'utilisateur
    const response = await client.post('/login').json({
      email: 'client@test.fr',
      password: 'password123'
    })

    // Pour le moment, ce test échouera (RED)
    response.assertStatus(302)
    response.assertRedirectsTo('/')
  })

  test('should reject login with invalid credentials', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'wrong@test.fr',
      password: 'wrongpass'
    })

    response.assertStatus(302)
    response.assertRedirectsTo('/login')
  })

  test('should validate email format', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'invalid-email',
      password: 'password123'
    })

    response.assertStatus(422)
    response.assertBodyContains('email')
  })

  test('should validate password minimum length', async ({ client }) => {
    const response = await client.post('/login').json({
      email: 'test@example.fr',
      password: '123'
    })

    response.assertStatus(422)
    response.assertBodyContains('password')
  })
})

test.group('Authentication - Register', () => {
  test('should show register page for guests', async ({ client }) => {
    const response = await client.get('/register')

    response.assertStatus(200)
    response.assertInertiaComponent('auth/register')
  })

  test('should register new client user', async ({ client, assert }) => {
    const response = await client.post('/register').json({
      email: 'newclient@test.fr',
      password: 'password123',
      password_confirmation: 'password123'
    })

    // RED: Ce test échouera initialement
    response.assertStatus(302)
    response.assertRedirectsTo('/')
  })

  test('should reject duplicate email registration', async ({ client }) => {
    // Créer d'abord un user, puis tenter de créer un autre avec même email
    await client.post('/register').json({
      email: 'duplicate@test.fr',
      password: 'password123',
      password_confirmation: 'password123'
    })

    const response = await client.post('/register').json({
      email: 'duplicate@test.fr',
      password: 'differentpass',
      password_confirmation: 'differentpass'
    })

    response.assertStatus(302)
    response.assertRedirectsTo('/register')
  })

  test('should validate password confirmation', async ({ client }) => {
    const response = await client.post('/register').json({
      email: 'test@example.fr',
      password: 'password123',
      password_confirmation: 'differentpass'
    })

    response.assertStatus(422)
    response.assertBodyContains('password')
  })
})

test.group('Authentication - Logout', () => {
  test('should logout authenticated user', async ({ client }) => {
    // Ce test nécessitera un user authentifié
    const response = await client.post('/logout')

    response.assertStatus(302)
    response.assertRedirectsTo('/login')
  })
})
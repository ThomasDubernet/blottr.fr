import { test } from '@japa/runner'
import AuthController from '#controllers/auth_controller'
import User from '#models/user'

test.group('AuthController Unit Tests', (group) => {
  // Mock des dépendances pour isoler les tests unitaires
  let authController: AuthController
  let mockContext: any

  group.setup(() => {
    authController = new AuthController()
  })

  group.each.setup(() => {
    // Mock du contexte HTTP pour chaque test
    mockContext = {
      inertia: {
        render: (view: string, data?: any) => ({ view, data }),
      },
      auth: {
        use: () => ({
          login: (user: User) => Promise.resolve(user),
          logout: () => Promise.resolve(),
        }),
      },
      request: {
        validateUsing: (_validator: any) =>
          Promise.resolve({
            email: 'test@example.fr',
            password: 'password123',
          }),
      },
      response: {
        redirect: () => ({
          toRoute: (route: string) => ({ route }),
          back: () => ({ back: true }),
        }),
      },
      session: {
        flash: (key: string, value: any) => ({ key, value }),
      },
    }
  })

  test('showLogin should render login page', async ({ assert }) => {
    const result = await authController.showLogin(mockContext)

    assert.deepEqual(result, {
      view: 'auth/login',
      data: {
        auth: {
          user: null,
        },
      },
    })
  })

  test('showRegister should render register page', async ({ assert }) => {
    const result = await authController.showRegister(mockContext)

    assert.deepEqual(result, {
      view: 'auth/register',
      data: {
        auth: {
          user: null,
        },
      },
    })
  })

  test('login should reject non-client users (role != 1)', async ({ assert }) => {
    // Mock User.verifyCredentials pour retourner un artiste
    const originalVerifyCredentials = User.verifyCredentials
    User.verifyCredentials = async () =>
      ({
        role: 2, // Artiste
        lastLoginAt: null,
        save: async () => {},
      }) as any

    let flashCalled = false
    mockContext.session.flash = () => {
      flashCalled = true
    }

    await authController.login(mockContext)

    assert.isTrue(flashCalled, 'Should flash error message for non-client user')

    // Restore original method
    User.verifyCredentials = originalVerifyCredentials
  })

  test('login should accept client users (role = 1)', async ({ assert }) => {
    // Mock User.verifyCredentials pour retourner un client
    const mockUser = {
      role: 1, // Client
      lastLoginAt: null,
      save: async () => {},
    }

    const originalVerifyCredentials = User.verifyCredentials
    User.verifyCredentials = async () => mockUser as any

    let loginCalled = false
    mockContext.auth.use = () => ({
      login: (user: any) => {
        loginCalled = true
        return Promise.resolve(user)
      },
    })

    await authController.login(mockContext)

    assert.isTrue(loginCalled, 'Should call auth.login for valid client')

    // Restore original method
    User.verifyCredentials = originalVerifyCredentials
  })

  test('register should create user with role=1 (client)', async ({ assert }) => {
    // Mock User.findBy pour ne pas trouver d'utilisateur existant
    const originalFindBy = User.findBy
    User.findBy = async () => null

    // Mock User.create
    const originalCreate = User.create
    let createdUserData: any
    User.create = async (data: any) => {
      createdUserData = data
      return { role: 1 } as any
    }

    let loginCalled = false
    mockContext.auth.use = () => ({
      login: () => {
        loginCalled = true
        return Promise.resolve()
      },
    })

    await authController.register(mockContext)

    assert.equal(createdUserData.role, 1, 'Should create user with client role')
    assert.equal(createdUserData.email, 'test@example.fr')
    assert.equal(createdUserData.tattooViewCount, 0)
    assert.equal(createdUserData.artistContactCount, 0)
    assert.isTrue(loginCalled, 'Should login user after registration')

    // Restore original methods
    User.findBy = originalFindBy
    User.create = originalCreate
  })

  test('register should reject duplicate email', async ({ assert }) => {
    // Mock User.findBy pour trouver un utilisateur existant
    const originalFindBy = User.findBy
    User.findBy = async () => ({ email: 'test@example.fr' }) as any

    let flashCalled = false
    mockContext.session.flash = () => {
      flashCalled = true
    }

    await authController.register(mockContext)

    assert.isTrue(flashCalled, 'Should flash error for duplicate email')

    // Restore original method
    User.findBy = originalFindBy
  })

  test('logout should call auth.logout and redirect', async ({ assert }) => {
    let logoutCalled = false
    let redirectCalled = false

    mockContext.auth.use = () => ({
      logout: () => {
        logoutCalled = true
        return Promise.resolve()
      },
    })

    mockContext.response.redirect = () => ({
      toRoute: (route: string) => {
        redirectCalled = true
        return { route }
      },
    })

    await authController.logout(mockContext)

    assert.isTrue(logoutCalled, 'Should call auth.logout')
    assert.isTrue(redirectCalled, 'Should redirect after logout')
  })

  test('login should update lastLoginAt timestamp', async ({ assert }) => {
    const mockUser = {
      role: 1,
      lastLoginAt: null,
      save: async function () {
        assert.isNotNull(this.lastLoginAt, 'lastLoginAt should be set')
      },
    }

    const originalVerifyCredentials = User.verifyCredentials
    User.verifyCredentials = async () => mockUser as any

    await authController.login(mockContext)

    // Restore original method
    User.verifyCredentials = originalVerifyCredentials
  })
})

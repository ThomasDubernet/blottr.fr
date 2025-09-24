/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import AuthController from '#controllers/auth_controller'

router.get('/', async ({ inertia }) => {
  return inertia.render('home', {
    title: 'Blottr - Discover Talented Tattoo Artists',
    description:
      'Find and connect with verified tattoo artists in your area. Browse portfolios, read reviews, and book appointments with confidence.',
  })
}).as('home')

// Authentication routes
router.group(() => {
  router.get('/login', [AuthController, 'showLogin']).as('auth.login')
  router.post('/login', [AuthController, 'login'])

  router.get('/register', [AuthController, 'showRegister']).as('auth.register')
  router.post('/register', [AuthController, 'register'])
}).middleware(['guest'])

// Logout route (ne doit PAS être protégé par guest middleware)
router.post('/logout', [AuthController, 'logout']).as('auth.logout')

// Design System Development Route
router.get('/design-system', async ({ inertia }) => {
  return inertia.render('design-system')
})

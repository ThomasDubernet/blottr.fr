/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async ({ inertia }) => {
  return inertia.render('home', {
    title: 'Blottr - Discover Talented Tattoo Artists',
    description:
      'Find and connect with verified tattoo artists in your area. Browse portfolios, read reviews, and book appointments with confidence.',
  })
})

// Design System Development Route
router.get('/design-system', async ({ inertia }) => {
  return inertia.render('design-system')
})

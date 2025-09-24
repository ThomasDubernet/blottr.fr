import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import City from '#models/city'

export default class extends BaseSeeder {
  async run() {
    // Check if users already exist
    const existingCount = await User.query().count('* as total')
    if (existingCount[0].$extras.total > 0) {
      return
    }

    // Get some cities for preferences
    const cities = await City.query().limit(3)
    const parisCity = cities.find((city) => city.name === 'Paris')
    const lyonCity = cities.find((city) => city.name === 'Lyon')

    const users = [
      // Client users (role: 1)
      {
        email: 'marie.dupont@email.com',
        password: 'password123',
        role: 1,
        phone: '+33 6 12 34 56 78',
        gender: 'female',
        preferredCityId: parisCity?.id || null,
        tattooViewCount: 45,
        artistContactCount: 3,
        stylePreferences: {
          styles: ['minimalist', 'watercolor'],
          bodyParts: ['bras', 'dos'],
          budget: '200-500',
        },
        notificationPreferences: {
          email: true,
          push: true,
          sms: false,
          frequency: 'weekly',
        },
      },
      {
        email: 'pierre.martin@email.com',
        password: 'password123',
        role: 1,
        phone: '+33 6 23 45 67 89',
        gender: 'male',
        preferredCityId: lyonCity?.id || null,
        tattooViewCount: 78,
        artistContactCount: 5,
        stylePreferences: {
          styles: ['traditional', 'japanese'],
          bodyParts: ['bras', 'torse'],
          budget: '300-800',
        },
        notificationPreferences: {
          email: true,
          push: false,
          sms: true,
          frequency: 'monthly',
        },
      },
      {
        email: 'sophie.bernard@email.com',
        password: 'password123',
        role: 1,
        phone: '+33 6 34 56 78 90',
        gender: 'female',
        preferredCityId: parisCity?.id || null,
        tattooViewCount: 23,
        artistContactCount: 1,
        stylePreferences: {
          styles: ['geometric', 'minimalist'],
          bodyParts: ['main', 'cou'],
          budget: '100-300',
        },
        notificationPreferences: {
          email: true,
          push: true,
          sms: false,
          frequency: 'daily',
        },
      },
      {
        email: 'lucas.moreau@email.com',
        password: 'password123',
        role: 1,
        phone: '+33 6 45 67 89 01',
        gender: 'male',
        preferredCityId: null, // No city preference
        tattooViewCount: 156,
        artistContactCount: 8,
        stylePreferences: {
          styles: ['realism', 'blackwork'],
          bodyParts: ['dos', 'jambe'],
          budget: '500-1200',
        },
        notificationPreferences: {
          email: false,
          push: true,
          sms: false,
          frequency: 'weekly',
        },
      },
      {
        email: 'camille.petit@email.com',
        password: 'password123',
        role: 1,
        phone: '+33 6 56 78 90 12',
        gender: 'non-binary',
        preferredCityId: cities[2]?.id || null,
        tattooViewCount: 89,
        artistContactCount: 4,
        stylePreferences: {
          styles: ['neo-traditional', 'watercolor'],
          bodyParts: ['bras', 'jambe'],
          budget: '400-600',
        },
        notificationPreferences: {
          email: true,
          push: true,
          sms: true,
          frequency: 'weekly',
        },
      },

      // Test admin user (role: 2 for now, can be changed later)
      {
        email: 'admin@blottr.fr',
        password: 'admin123',
        role: 2, // Will be used as admin
        phone: '+33 1 23 45 67 89',
        gender: null,
        preferredCityId: parisCity?.id || null,
        tattooViewCount: 0,
        artistContactCount: 0,
        stylePreferences: null,
        notificationPreferences: {
          email: true,
          push: true,
          sms: false,
          frequency: 'daily',
        },
      },
    ]

    await User.createMany(users)
    console.log('✅ Users seeded successfully')
  }
}

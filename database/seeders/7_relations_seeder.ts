import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'
import Artist from '#models/artist'
import Salon from '#models/salon'

export default class extends BaseSeeder {
  async run() {
    // Get all artists and salons
    const artists = await Artist.query()
    const salons = await Salon.query()

    if (artists.length === 0 || salons.length === 0) {
      console.log('No artists or salons found. Please run previous seeders first.')
      return
    }

    // Relationship types for variety
    const relationshipTypes = ['primary', 'guest', 'freelance']

    // Sample schedules
    const schedules = [
      {
        monday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        tuesday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        wednesday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        thursday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        friday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        saturday: { isWorking: false },
        sunday: { isWorking: false },
      },
      {
        monday: { isWorking: false },
        tuesday: { isWorking: true, startTime: '11:00', endTime: '19:00' },
        wednesday: { isWorking: true, startTime: '11:00', endTime: '19:00' },
        thursday: { isWorking: true, startTime: '11:00', endTime: '19:00' },
        friday: { isWorking: true, startTime: '11:00', endTime: '19:00' },
        saturday: { isWorking: true, startTime: '11:00', endTime: '19:00' },
        sunday: { isWorking: false },
      },
      {
        monday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
        tuesday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
        wednesday: { isWorking: false },
        thursday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
        friday: { isWorking: true, startTime: '09:00', endTime: '17:00' },
        saturday: { isWorking: true, startTime: '10:00', endTime: '16:00' },
        sunday: { isWorking: false },
      },
      {
        monday: { isWorking: true, startTime: '12:00', endTime: '20:00' },
        tuesday: { isWorking: true, startTime: '12:00', endTime: '20:00' },
        wednesday: { isWorking: true, startTime: '12:00', endTime: '20:00' },
        thursday: { isWorking: true, startTime: '12:00', endTime: '20:00' },
        friday: { isWorking: false },
        saturday: { isWorking: true, startTime: '10:00', endTime: '18:00' },
        sunday: { isWorking: false },
      },
    ]

    let relationshipCount = 0

    // Associate each artist with 1-3 salons
    for (const artist of artists) {
      // Random number of salons (1-3)
      const numberOfSalons = Math.floor(Math.random() * 3) + 1

      // Randomly select salons
      const shuffledSalons = salons.sort(() => 0.5 - Math.random())
      const selectedSalons = shuffledSalons.slice(0, numberOfSalons)

      for (let i = 0; i < selectedSalons.length; i++) {
        const salon = selectedSalons[i]
        const isPrimary = i === 0 // First salon is primary

        // Determine relationship type
        let relationshipType: string
        if (isPrimary) {
          relationshipType = 'primary'
        } else {
          relationshipType = Math.random() > 0.5 ? 'guest' : 'freelance'
        }

        // Random hourly rate based on artist experience
        const baseRate = 80
        const experienceFactor = artist.yearsExperience || 5
        const hourlyRate = baseRate + experienceFactor * 5 + Math.random() * 20

        // Commission rate (higher for guests/freelance, lower for primary)
        let commissionRate: number
        if (relationshipType === 'primary') {
          commissionRate = 0.15 + Math.random() * 0.1 // 15-25% for primary artists
        } else {
          commissionRate = 0.3 + Math.random() * 0.15 // 30-45% for guests/freelance
        }

        // Start date (random date in the past 1-5 years)
        const yearsAgo = Math.floor(Math.random() * 5) + 1
        const startedWorkingAt = DateTime.now().minus({ years: yearsAgo, days: Math.random() * 365 })

        // End date (null for active, date for 20% of relationships)
        const isActive = Math.random() > 0.2
        const endedWorkingAt = isActive
          ? null
          : startedWorkingAt.plus({ months: Math.random() * 24 })

        // Random schedule
        const schedule = schedules[Math.floor(Math.random() * schedules.length)]

        // Notes
        const notes = isPrimary
          ? 'Artiste principal du salon'
          : relationshipType === 'guest'
            ? 'Artiste invité pour sessions spéciales'
            : 'Freelance avec location de chaise'

        // Attach the salon to the artist with pivot data
        await artist.related('salons').attach({
          [salon.id]: {
            relationship_type: relationshipType,
            is_active: isActive,
            schedule: JSON.stringify(schedule),
            hourly_rate: Math.round(hourlyRate * 100) / 100, // Round to 2 decimals
            commission_rate: Math.round(commissionRate * 100) / 100,
            started_working_at: startedWorkingAt.toSQL(),
            ended_working_at: endedWorkingAt ? endedWorkingAt.toSQL() : null,
            notes: notes,
          },
        })

        relationshipCount++
      }
    }

    console.log(`Created ${relationshipCount} artist-salon relationships`)
    console.log(`Average salons per artist: ${(relationshipCount / artists.length).toFixed(1)}`)
  }
}

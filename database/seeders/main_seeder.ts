import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  private async runSeeder(SeederClass: any, name: string) {
    try {
      console.log(`🌱 Seeding ${name}...`)
      await new SeederClass().run()
      console.log(`✅ ${name} seeded successfully`)
    } catch (error) {
      console.error(`❌ Error seeding ${name}:`, error.message)
      throw error
    }
  }

  async run() {
    console.log('🚀 Starting database seeding...')
    console.log('=======================================')

    try {
      // Import all seeders dynamically
      const citySeederModule = await import('./01_city_seeder.js')
      const tagSeederModule = await import('./02_tag_seeder.js')
      const userSeederModule = await import('./03_user_seeder.js')
      const salonSeederModule = await import('./04_salon_seeder.js')
      const artistSeederModule = await import('./05_artist_seeder.js')
      const tattooSeederModule = await import('./06_tattoo_seeder.js')
      const contactRequestSeederModule = await import('./07_contact_request_seeder.js')

      const CitySeeder = citySeederModule.default
      const TagSeeder = tagSeederModule.default
      const UserSeeder = userSeederModule.default
      const SalonSeeder = salonSeederModule.default
      const ArtistSeeder = artistSeederModule.default
      const TattooSeeder = tattooSeederModule.default
      const ContactRequestSeeder = contactRequestSeederModule.default

      // Run seeders in dependency order
      await this.runSeeder(CitySeeder, 'Cities')
      await this.runSeeder(TagSeeder, 'Tags')
      await this.runSeeder(UserSeeder, 'Users')
      await this.runSeeder(SalonSeeder, 'Salons')
      await this.runSeeder(ArtistSeeder, 'Artists')
      await this.runSeeder(TattooSeeder, 'Tattoos')
      await this.runSeeder(ContactRequestSeeder, 'Contact Requests')

      console.log('=======================================')
      console.log('🎉 All seeders completed successfully!')
      console.log('')
      console.log('📊 Database populated with:')
      console.log('   • 8 Cities (major French tattoo scenes)')
      console.log('   • 23 Tags (styles, body parts, themes, colors)')
      console.log('   • 6 Users (5 clients + 1 admin)')
      console.log('   • 6 Salons (verified tattoo studios)')
      console.log('   • 8 Artists (various verification stages)')
      console.log('   • 12+ Tattoos (with tag relationships)')
      console.log('   • 9 Contact Requests (various statuses)')
      console.log('')
      console.log('🔗 Relationships created:')
      console.log('   • Artist ↔ Salon associations')
      console.log('   • Tattoo ↔ Tag many-to-many')
      console.log('   • User preferences and city links')
      console.log('   • Contact workflow examples')
      console.log('')
      console.log('✨ Your Blottr database is ready for development!')
    } catch (error) {
      console.error('💥 Seeding failed:', error.message)
      throw error
    }
  }
}

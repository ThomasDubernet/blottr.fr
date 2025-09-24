import { BaseSeeder } from "@adonisjs/lucid/seeders";
import City from "#models/city";

export default class extends BaseSeeder {
  async run() {
    // Check if cities already exist
    const existingCount = await City.query().count("* as total");
    if (existingCount[0].$extras.total > 0) {
      return;
    }

    const cities = [
      // Major French cities for tattoo scenes
      {
        name: "Paris",
        slug: "paris",
        department: "Paris",
        region: "Île-de-France",
        country: "FR",
        latitude: 48.8566,
        longitude: 2.3522,
        postalCode: "75000",
        seoTitle: "Artistes Tatoueurs à Paris - Trouvez votre tatoueur",
        seoDescription:
          "Découvrez les meilleurs artistes tatoueurs de Paris. Studios, styles et portfolios des tatoueurs parisiens.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Lyon",
        slug: "lyon",
        department: "Rhône",
        region: "Auvergne-Rhône-Alpes",
        country: "FR",
        latitude: 45.764,
        longitude: 4.8357,
        postalCode: "69000",
        seoTitle: "Artistes Tatoueurs à Lyon - Studios de tatouage lyonnais",
        seoDescription:
          "Trouvez votre tatoueur à Lyon. Découvrez les studios et artistes tatoueurs de la région lyonnaise.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Marseille",
        slug: "marseille",
        department: "Bouches-du-Rhône",
        region: "Provence-Alpes-Côte d'Azur",
        country: "FR",
        latitude: 43.2965,
        longitude: 5.3698,
        postalCode: "13000",
        seoTitle: "Tatoueurs Marseille - Studios de tatouage PACA",
        seoDescription:
          "Artistes tatoueurs à Marseille et région PACA. Styles traditionnels et modernes.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Toulouse",
        slug: "toulouse",
        department: "Haute-Garonne",
        region: "Occitanie",
        country: "FR",
        latitude: 43.6047,
        longitude: 1.4442,
        postalCode: "31000",
        seoTitle: "Tatoueurs à Toulouse - Art du tatouage en Occitanie",
        seoDescription:
          "Studios de tatouage et artistes tatoueurs à Toulouse. Découvrez la scène tattoo toulousaine.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Bordeaux",
        slug: "bordeaux",
        department: "Gironde",
        region: "Nouvelle-Aquitaine",
        country: "FR",
        latitude: 44.8378,
        longitude: -0.5792,
        postalCode: "33000",
        seoTitle: "Artistes Tatoueurs Bordeaux - Studios Nouvelle-Aquitaine",
        seoDescription:
          "Tatoueurs et studios de tatouage à Bordeaux. Art corporel et tatouages personnalisés.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Nantes",
        slug: "nantes",
        department: "Loire-Atlantique",
        region: "Pays de la Loire",
        country: "FR",
        latitude: 47.2184,
        longitude: -1.5536,
        postalCode: "44000",
        seoTitle: "Tatoueurs Nantes - Studios tatouage Pays de la Loire",
        seoDescription:
          "Découvrez les tatoueurs de Nantes. Studios et artistes tatoueurs de la région.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Lille",
        slug: "lille",
        department: "Nord",
        region: "Hauts-de-France",
        country: "FR",
        latitude: 50.6292,
        longitude: 3.0573,
        postalCode: "59000",
        seoTitle: "Tatoueurs Lille - Art du tatouage Hauts-de-France",
        seoDescription:
          "Studios de tatouage à Lille. Artistes tatoueurs du Nord de la France.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
      {
        name: "Montpellier",
        slug: "montpellier",
        department: "Hérault",
        region: "Occitanie",
        country: "FR",
        latitude: 43.6119,
        longitude: 3.8772,
        postalCode: "34000",
        seoTitle: "Tatoueurs Montpellier - Studios tatouage Hérault",
        seoDescription:
          "Artistes tatoueurs à Montpellier et dans l'Hérault. Styles variés et expertise reconnue.",
        artistCount: 0,
        salonCount: 0,
        tattooCount: 0,
      },
    ];

    await City.createMany(cities);
    console.log("✅ Cities seeded successfully");
  }
}

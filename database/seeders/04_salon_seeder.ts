import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Salon from "#models/salon";
import City from "#models/city";

export default class extends BaseSeeder {
  async run() {
    // Check if salons already exist
    const existingCount = await Salon.query().count("* as total");
    if (existingCount[0].$extras.total > 0) {
      return;
    }

    // Get cities for salon locations
    const cities = await City.all();
    const paris = cities.find((city) => city.name === "Paris");
    const lyon = cities.find((city) => city.name === "Lyon");
    const marseille = cities.find((city) => city.name === "Marseille");
    const bordeaux = cities.find((city) => city.name === "Bordeaux");

    const salons = [
      {
        name: "Ink Masters Paris",
        slug: "ink-masters-paris",
        email: "contact@inkmastersaris.fr",
        phone: "+33 1 42 36 78 90",
        street: "15 rue de Rivoli",
        city: "Paris",
        zip: "75001",
        country: "FR",
        cityId: paris?.id || null,
        description:
          "Studio de tatouage haut de gamme au cœur de Paris. Spécialisés dans le réalisme et les portraits. Équipe d'artistes reconnus internationalement.",
        lgbtqFriendly: true,
        logo: "/images/salons/ink-masters-paris.jpg",
        isPrivate: false,
        isVerified: true,
        editorPick: true,
        website: "https://www.inkmastersaris.fr",
        socialLinks: {
          instagram: "https://instagram.com/inkmastersaris",
          facebook: "https://facebook.com/inkmastersaris",
        },
        seoTitle: "Ink Masters Paris - Studio de tatouage premium",
        seoDescription:
          "Studio de tatouage de luxe à Paris. Artistes spécialisés en réalisme, portraits et tatouages personnalisés.",
        viewCount: 1245,
        contactCount: 89,
      },
      {
        name: "Black Rose Tattoo",
        slug: "black-rose-tattoo-lyon",
        email: "hello@blackrosetattoo.fr",
        phone: "+33 4 78 45 67 89",
        street: "42 rue de la République",
        city: "Lyon",
        zip: "69002",
        country: "FR",
        cityId: lyon?.id || null,
        description:
          "Salon de tatouage traditionnel lyonnais depuis 2008. Ambiance chaleureuse et artwork de qualité. Spécialités : old school, neo-traditional.",
        lgbtqFriendly: true,
        logo: "/images/salons/black-rose.jpg",
        isPrivate: false,
        isVerified: true,
        editorPick: false,
        website: "https://www.blackrosetattoo.fr",
        socialLinks: {
          instagram: "https://instagram.com/blackrosetattoo_lyon",
          tiktok: "https://tiktok.com/@blackrosetattoo",
        },
        seoTitle: "Black Rose Tattoo Lyon - Tatouage traditionnel",
        seoDescription:
          "Salon de tatouage à Lyon spécialisé en old school et neo-traditional. Ambiance conviviale et qualité garantie.",
        viewCount: 876,
        contactCount: 54,
      },
      {
        name: "Electric Octopus",
        slug: "electric-octopus-marseille",
        email: "info@electricoctopus.fr",
        phone: "+33 4 91 23 45 67",
        street: "8 rue Saint-Ferréol",
        city: "Marseille",
        zip: "13001",
        country: "FR",
        cityId: marseille?.id || null,
        description:
          "Studio moderne et créatif près du Vieux-Port. Atmosphère décontractée pour des tatouages originaux. Focus sur le custom et les créations uniques.",
        lgbtqFriendly: true,
        logo: "/images/salons/electric-octopus.jpg",
        isPrivate: false,
        isVerified: true,
        editorPick: true,
        website: "https://www.electricoctopus.fr",
        socialLinks: {
          instagram: "https://instagram.com/electricoctopus_marseille",
          website: "https://www.electricoctopus.fr/blog",
        },
        seoTitle: "Electric Octopus Marseille - Tatouage créatif",
        seoDescription:
          "Studio de tatouage créatif à Marseille. Artistes spécialisés dans les créations sur-mesure et designs originaux.",
        viewCount: 654,
        contactCount: 31,
      },
      {
        name: "Minimal Ink Studio",
        slug: "minimal-ink-studio-paris",
        email: "contact@minimalink.fr",
        phone: "+33 1 43 87 65 43",
        street: "23 rue Oberkampf",
        city: "Paris",
        zip: "75011",
        country: "FR",
        cityId: paris?.id || null,
        description:
          "Studio spécialisé dans le tatouage minimaliste et fine line. Ambiance zen et épurée. Parfait pour les premiers tatouages et designs délicats.",
        lgbtqFriendly: true,
        logo: "/images/salons/minimal-ink.jpg",
        isPrivate: false,
        isVerified: true,
        editorPick: false,
        website: "https://www.minimalink.fr",
        socialLinks: {
          instagram: "https://instagram.com/minimalink_paris",
          pinterest: "https://pinterest.com/minimalinkstudio",
        },
        seoTitle: "Minimal Ink Studio Paris - Tatouage minimaliste",
        seoDescription:
          "Studio parisien de tatouage minimaliste et fine line. Spécialiste des petits tatouages délicats et élégants.",
        viewCount: 432,
        contactCount: 67,
      },
      {
        name: "Traditional Bordeaux Tattoo",
        slug: "traditional-bordeaux-tattoo",
        email: "contact@traditionalbx.fr",
        phone: "+33 5 56 78 90 12",
        street: "56 rue Sainte-Catherine",
        city: "Bordeaux",
        zip: "33000",
        country: "FR",
        cityId: bordeaux?.id || null,
        description:
          "Salon traditionnel bordelais respectant les codes du tatouage old school. Ambiance authentique et savoir-faire reconnu. Flash disponibles.",
        lgbtqFriendly: false, // Traditional salon
        logo: "/images/salons/traditional-bordeaux.jpg",
        isPrivate: false,
        isVerified: true,
        editorPick: false,
        website: null,
        socialLinks: {
          instagram: "https://instagram.com/traditional_bordeaux_tattoo",
        },
        seoTitle: "Traditional Bordeaux Tattoo - Old school authentique",
        seoDescription:
          "Salon de tatouage traditionnel à Bordeaux. Spécialiste du style old school et american traditional.",
        viewCount: 321,
        contactCount: 23,
      },
      {
        name: "Underground Collective",
        slug: "underground-collective-lyon",
        email: "crew@undergroundcollective.fr",
        phone: "+33 4 72 34 56 78",
        street: "12 rue de la Bourse",
        city: "Lyon",
        zip: "69002",
        country: "FR",
        cityId: lyon?.id || null,
        description:
          "Collectif d'artistes indépendants partageant un espace commun. Styles variés et approche collaborative. Chaque artiste son univers.",
        lgbtqFriendly: true,
        logo: "/images/salons/underground-collective.jpg",
        isPrivate: true, // Semi-private collective
        isVerified: true,
        editorPick: false,
        website: "https://www.undergroundcollective.fr",
        socialLinks: {
          instagram: "https://instagram.com/underground_collective_lyon",
          facebook: "https://facebook.com/undergroundcollective",
        },
        seoTitle: "Underground Collective Lyon - Artistes indépendants",
        seoDescription:
          "Collectif d'artistes tatoueurs indépendants à Lyon. Diversité de styles et approche collaborative.",
        viewCount: 789,
        contactCount: 45,
      },
    ];

    await Salon.createMany(salons);
    console.log("✅ Salons seeded successfully");
  }
}

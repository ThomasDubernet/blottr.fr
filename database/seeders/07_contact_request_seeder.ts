import { BaseSeeder } from "@adonisjs/lucid/seeders";
import ContactRequest from "#models/contact_request";
import User from "#models/user";
import Artist from "#models/artist";

export default class extends BaseSeeder {
  async run() {
    // Check if contact requests already exist
    const existingCount = await ContactRequest.query().count("* as total");
    if (existingCount[0].$extras.total > 0) {
      return;
    }

    // Get users and artists
    const users = await User.query().where("role", 1); // Only clients
    const artists = await Artist.query().where("isVerified", true);

    if (users.length === 0 || artists.length === 0) {
      console.log(
        "⚠️  Skipping contact requests seeding - no users or artists found",
      );
      return;
    }

    // Get specific users by email
    const marie = users.find((u) => u.email === "marie.dupont@email.com");
    const pierre = users.find((u) => u.email === "pierre.martin@email.com");
    const sophie = users.find((u) => u.email === "sophie.bernard@email.com");
    const lucas = users.find((u) => u.email === "lucas.moreau@email.com");

    // Get specific artists
    const alexandre = artists.find((a) => a.slug === "alexandre-moreau-paris");
    const sarah = artists.find((a) => a.slug === "sarah-chen-lyon");
    const emma = artists.find(
      (a) => a.slug === "emma-laurent-paris-minimalist",
    );
    const nina = artists.find(
      (a) => a.slug === "nina-rodriguez-paris-independent",
    );

    const contactRequests = [
      // Completed conversations
      {
        clientId: marie?.id || users[0]?.id,
        artistId: emma?.id || artists[0]?.id,
        message:
          "Bonjour Emma, je suis très intéressée par votre travail minimaliste. J'aimerais un petit tatouage floral sur l'avant-bras, quelque chose de discret mais élégant. Pourriez-vous me dire si c'est possible et quel serait le tarif ? Merci beaucoup !",
        status: "completed",
        preferredContactMethod: "email",
        availability: {
          days: ["monday", "wednesday", "friday"],
          timeSlots: ["morning", "afternoon"],
          urgency: "flexible",
        },
        budgetMin: 100.0,
        budgetMax: 250.0,
        urgency: "flexible",
      },
      {
        clientId: pierre?.id || users[1]?.id,
        artistId: sarah?.id || artists[1]?.id,
        message:
          "Salut Sarah ! J'ai vu tes créations néo-traditionnelles sur Instagram et c'est exactement ce que je recherche. Je voudrais un dragon japonais sur l'épaule, avec tes couleurs caractéristiques. Tu aurais de la disponibilité dans les prochaines semaines ?",
        status: "completed",
        preferredContactMethod: "phone",
        availability: {
          days: ["tuesday", "thursday", "saturday"],
          timeSlots: ["afternoon", "evening"],
          urgency: "this_month",
        },
        budgetMin: 300.0,
        budgetMax: 600.0,
        urgency: "this_month",
      },

      // Artist responded
      {
        clientId: lucas?.id || users[2]?.id,
        artistId: alexandre?.id || artists[2]?.id,
        message:
          "Bonjour Alexandre, je suis un grand admirateur de votre travail en réalisme. Je souhaiterais faire un portrait de mon grand-père décédé, j'ai plusieurs photos de référence. C'est un projet très personnel et important pour moi. Seriez-vous disponible pour en discuter ?",
        status: "artist_responded",
        preferredContactMethod: "email",
        availability: {
          days: ["monday", "tuesday", "wednesday", "thursday", "friday"],
          timeSlots: ["evening"],
          urgency: "flexible",
        },
        budgetMin: 400.0,
        budgetMax: 800.0,
        urgency: "flexible",
      },
      {
        clientId: sophie?.id || users[3]?.id,
        artistId: nina?.id || artists[3]?.id,
        message:
          "Bonjour Nina, votre style chicano me fascine ! Je recherche quelque chose dans l'esprit Dia de los Muertos, peut-être une Catrina élégante. Travaillez-vous sur ce type de projets ? Je suis très flexible sur les dates.",
        status: "artist_responded",
        preferredContactMethod: "instagram",
        availability: {
          days: ["saturday", "sunday"],
          timeSlots: ["morning", "afternoon"],
          urgency: "flexible",
        },
        budgetMin: 250.0,
        budgetMax: 500.0,
        urgency: "flexible",
      },

      // Artist contacted (notification sent)
      {
        clientId: marie?.id || users[0]?.id,
        artistId: alexandre?.id || artists[2]?.id,
        message:
          "Bonjour, je cherche un artiste capable de réaliser un portrait réaliste de mon chat décédé récemment. J'ai vu votre travail et je pense que vous pourriez créer quelque chose de magnifique. Acceptez-vous ce genre de projet ?",
        status: "artist_contacted",
        preferredContactMethod: "email",
        availability: {
          days: ["wednesday", "friday", "saturday"],
          timeSlots: ["afternoon"],
          urgency: "flexible",
        },
        budgetMin: 200.0,
        budgetMax: 400.0,
        urgency: "flexible",
      },
      {
        clientId: pierre?.id || users[1]?.id,
        artistId: emma?.id || artists[0]?.id,
        message:
          "Hello Emma ! Je cherche quelqu'un pour un tatouage minimaliste représentant les constellations de mes enfants (dates de naissance). Votre style fine line serait parfait. Vous faites ce type de créations personnalisées ?",
        status: "artist_contacted",
        preferredContactMethod: "instagram",
        availability: {
          days: ["monday", "thursday"],
          timeSlots: ["evening"],
          urgency: "this_month",
        },
        budgetMin: 150.0,
        budgetMax: 300.0,
        urgency: "this_month",
      },

      // Pending (new requests)
      {
        clientId: sophie?.id || users[3]?.id,
        artistId: sarah?.id || artists[1]?.id,
        message:
          "Bonjour ! Je découvre votre univers et j'adore ! Je cherche à faire mon premier tatouage, quelque chose de floral mais pas trop imposant. Vous faites des consultations pour discuter des idées ? Merci !",
        status: "pending",
        preferredContactMethod: "phone",
        availability: {
          days: ["tuesday", "wednesday", "thursday"],
          timeSlots: ["afternoon"],
          urgency: "flexible",
        },
        budgetMin: 100.0,
        budgetMax: 250.0,
        urgency: "flexible",
      },
      {
        clientId: lucas?.id || users[2]?.id,
        artistId: nina?.id || artists[3]?.id,
        message:
          "Salut ! Ton style chicano est dingue ! Je kiffe grave ce que tu fais. Je voudrais quelque chose dans le genre Day of the Dead mais avec une touche perso. Tu serais chaud pour en parler ? 🔥💀",
        status: "pending",
        preferredContactMethod: "instagram",
        availability: {
          days: ["friday", "saturday", "sunday"],
          timeSlots: ["afternoon", "evening"],
          urgency: "asap",
        },
        budgetMin: 300.0,
        budgetMax: 600.0,
        urgency: "asap",
      },

      // Cross-referencing for analytics
      {
        clientId: users[4]?.id || users[0]?.id, // Camille
        artistId: emma?.id || artists[0]?.id,
        message:
          "Bonjour Emma, je suis non-binaire et je cherche un⋅e tatoueur⋅se qui comprend les enjeux LGBTQ+. Votre travail me plaît beaucoup et j'aimerais discuter d'un projet minimaliste représentant ma transition. Merci pour votre inclusivité.",
        status: "pending",
        preferredContactMethod: "email",
        availability: {
          days: ["monday", "wednesday", "friday"],
          timeSlots: ["morning", "afternoon"],
          urgency: "flexible",
        },
        budgetMin: 150.0,
        budgetMax: 350.0,
        urgency: "flexible",
      },
    ];

    await ContactRequest.createMany(contactRequests);
    console.log("✅ Contact requests seeded successfully");
  }
}

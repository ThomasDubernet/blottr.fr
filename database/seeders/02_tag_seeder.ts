import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Tag from "#models/tag";

export default class extends BaseSeeder {
  async run() {
    // Check if tags already exist
    const existingCount = await Tag.query().count("* as total");
    if (existingCount[0].$extras.total > 0) {
      return;
    }

    const tags = [
      // Style categories
      {
        name: "Traditional",
        slug: "traditional",
        category: "style",
        variants: ["Old School", "American Traditional", "Classic"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Realism",
        slug: "realism",
        category: "style",
        variants: ["Photorealistic", "Portrait", "Hyperrealistic"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Neo Traditional",
        slug: "neo-traditional",
        category: "style",
        variants: ["New School", "Modern Traditional"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Watercolor",
        slug: "watercolor",
        category: "style",
        variants: ["Aquarelle", "Paint Splash"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Geometric",
        slug: "geometric",
        category: "style",
        variants: ["Sacred Geometry", "Abstract Geometric"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Minimalist",
        slug: "minimalist",
        category: "style",
        variants: ["Fine Line", "Small Tattoo", "Simple"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Japanese",
        slug: "japanese",
        category: "style",
        variants: ["Irezumi", "Oriental", "Asian"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Blackwork",
        slug: "blackwork",
        category: "style",
        variants: ["Black and Grey", "Solid Black"],
        usageCount: 0,
        isFeatured: false,
      },

      // Body part categories
      {
        name: "Bras",
        slug: "bras",
        category: "body_part",
        variants: ["Avant-bras", "Biceps", "Épaule"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Dos",
        slug: "dos",
        category: "body_part",
        variants: ["Haut du dos", "Bas du dos", "Dos complet"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Torse",
        slug: "torse",
        category: "body_part",
        variants: ["Poitrine", "Sternum", "Côtes"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Jambe",
        slug: "jambe",
        category: "body_part",
        variants: ["Cuisse", "Mollet", "Cheville"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Main",
        slug: "main",
        category: "body_part",
        variants: ["Doigt", "Paume", "Poignet"],
        usageCount: 0,
        isFeatured: false,
      },
      {
        name: "Cou",
        slug: "cou",
        category: "body_part",
        variants: ["Nuque", "Gorge", "Derrière l'oreille"],
        usageCount: 0,
        isFeatured: false,
      },

      // Theme categories
      {
        name: "Animaux",
        slug: "animaux",
        category: "theme",
        variants: ["Lion", "Loup", "Oiseau", "Chat"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Fleurs",
        slug: "fleurs",
        category: "theme",
        variants: ["Rose", "Lotus", "Pivoine", "Cerisier"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Portrait",
        slug: "portrait",
        category: "theme",
        variants: ["Visage", "Personnage célèbre", "Proche"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Mandala",
        slug: "mandala",
        category: "theme",
        variants: ["Symétrique", "Spirituel", "Ornemental"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Lettrage",
        slug: "lettrage",
        category: "theme",
        variants: ["Calligraphie", "Citation", "Nom", "Date"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Tribal",
        slug: "tribal",
        category: "theme",
        variants: ["Polynésien", "Celtique", "Maori"],
        usageCount: 0,
        isFeatured: false,
      },

      // Color categories
      {
        name: "Couleur",
        slug: "couleur",
        category: "color",
        variants: ["Multicolore", "Vif", "Pastel"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Noir et Gris",
        slug: "noir-et-gris",
        category: "color",
        variants: ["Black & Grey", "Monochrome", "Nuances de gris"],
        usageCount: 0,
        isFeatured: true,
      },
      {
        name: "Noir",
        slug: "noir",
        category: "color",
        variants: ["Blackout", "Solid Black", "Encre noire"],
        usageCount: 0,
        isFeatured: false,
      },
    ];

    // Create tags one by one to debug JSON serialization
    for (const tagData of tags) {
      try {
        // Manually serialize variants as JSON
        const processedTagData = {
          ...tagData,
          variants: tagData.variants ? JSON.stringify(tagData.variants) : null,
        };

        const tag = await Tag.create(processedTagData);
        console.log(`✅ Created tag: ${tag.name}`);
      } catch (error) {
        console.error(`❌ Error creating tag ${tagData.name}:`, error.message);
        throw error;
      }
    }

    console.log("✅ Tags seeded successfully");
  }
}

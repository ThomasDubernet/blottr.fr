import { BaseSeeder } from "@adonisjs/lucid/seeders";
import Tattoo from "#models/tattoo";
import Artist from "#models/artist";
import Salon from "#models/salon";
import Tag from "#models/tag";

export default class extends BaseSeeder {
  async run() {
    // Check if tattoos already exist
    const existingCount = await Tattoo.query().count("* as total");
    if (existingCount[0].$extras.total > 0) {
      return;
    }

    // Get artists and salons for relationships
    const artists = await Artist.all();
    const salons = await Salon.all();
    const tags = await Tag.all();

    // Get specific artists by slug
    const alexandre = artists.find((a) => a.slug === "alexandre-moreau-paris");
    const sarah = artists.find((a) => a.slug === "sarah-chen-lyon");
    const marco = artists.find((a) => a.slug === "marco-dubois-marseille");
    const emma = artists.find(
      (a) => a.slug === "emma-laurent-paris-minimalist",
    );
    const nina = artists.find(
      (a) => a.slug === "nina-rodriguez-paris-independent",
    );

    const tattoos = [
      // Alexandre's realistic works
      {
        artistId: alexandre?.id || artists[0]?.id,
        salonId: alexandre?.salonId,
        photo: "/images/tattoos/alexandre-portrait-1.jpg",
        description:
          "Portrait réaliste noir et blanc d'une femme aux yeux perçants. Technique pointilliste pour les ombrages.",
        isFlash: false,
        price: null, // Custom work, price on consultation
        slug: "portrait-realiste-femme-alexandre",
        altText: "Portrait réaliste femme noir et blanc tatouage",
        isFeatured: true,
        isVisible: true,
        viewCount: 342,
        likeCount: 89,
        instagramPostUrl: "https://instagram.com/p/alex_portrait_1",
      },
      {
        artistId: alexandre?.id || artists[0]?.id,
        salonId: alexandre?.salonId,
        photo: "/images/tattoos/alexandre-lion.jpg",
        description:
          "Tête de lion majestueuse en réalisme. Détails saisissants dans la crinière et expression intense du regard.",
        isFlash: false,
        price: null,
        slug: "lion-realiste-alexandre-moreau",
        altText: "Tatouage lion réaliste noir et blanc",
        isFeatured: true,
        isVisible: true,
        viewCount: 567,
        likeCount: 134,
        instagramPostUrl: "https://instagram.com/p/alex_lion_king",
      },

      // Sarah's neo-traditional works
      {
        artistId: sarah?.id || artists[1]?.id,
        salonId: sarah?.salonId,
        photo: "/images/tattoos/sarah-pivoine-1.jpg",
        description:
          "Pivoine néo-traditionnelle avec influences japonaises. Mélange de couleurs vives et contours nets.",
        isFlash: false,
        price: null,
        slug: "pivoine-neo-traditionnelle-sarah",
        altText: "Tatouage pivoine néo-traditionnel japonais",
        isFeatured: true,
        isVisible: true,
        viewCount: 423,
        likeCount: 76,
        instagramPostUrl: "https://instagram.com/p/sarah_peony_bloom",
      },
      {
        artistId: sarah?.id || artists[1]?.id,
        salonId: sarah?.salonId,
        photo: "/images/tattoos/sarah-dragon.jpg",
        description:
          "Dragon japonais traditionnel revisité dans un style néo-traditionnel moderne. Couleurs éclatantes.",
        isFlash: false,
        price: null,
        slug: "dragon-japonais-sarah-chen",
        altText: "Dragon japonais néo-traditionnel couleur",
        isFeatured: false,
        isVisible: true,
        viewCount: 289,
        likeCount: 45,
        instagramPostUrl: "https://instagram.com/p/sarah_dragon_power",
      },

      // Marco's geometric works
      {
        artistId: marco?.id || artists[2]?.id,
        salonId: marco?.salonId,
        photo: "/images/tattoos/marco-mandala.jpg",
        description:
          "Mandala géométrique complexe avec motifs fractals. Précision mathématique et équilibre parfait.",
        isFlash: false,
        price: null,
        slug: "mandala-geometrique-marco",
        altText: "Mandala géométrique fractal tatouage",
        isFeatured: true,
        isVisible: true,
        viewCount: 678,
        likeCount: 98,
        instagramPostUrl: "https://instagram.com/p/marco_mandala_math",
      },
      {
        artistId: marco?.id || artists[2]?.id,
        salonId: marco?.salonId,
        photo: "/images/tattoos/marco-triangle.jpg",
        description:
          "Composition triangulaire abstraite avec jeu de lignes et espaces négatifs.",
        isFlash: true,
        price: 280.0,
        slug: "triangle-abstrait-marco-dubois",
        altText: "Tatouage triangle géométrique abstrait",
        isFeatured: false,
        isVisible: true,
        viewCount: 156,
        likeCount: 23,
        instagramPostUrl: "https://instagram.com/p/marco_triangle_flash",
      },

      // Emma's minimalist works
      {
        artistId: emma?.id || artists[3]?.id,
        salonId: emma?.salonId,
        photo: "/images/tattoos/emma-line-flower.jpg",
        description:
          "Fleur stylisée en trait fin. Élégance minimaliste pour un premier tatouage parfait.",
        isFlash: true,
        price: 120.0,
        slug: "fleur-minimaliste-emma-laurent",
        altText: "Petite fleur minimaliste fine line",
        isFeatured: true,
        isVisible: true,
        viewCount: 892,
        likeCount: 167,
        instagramPostUrl: "https://instagram.com/p/emma_flower_line",
      },
      {
        artistId: emma?.id || artists[3]?.id,
        salonId: emma?.salonId,
        photo: "/images/tattoos/emma-moon-phases.jpg",
        description:
          "Phases de lune en fine line. Délicatesse et poésie dans la simplicité.",
        isFlash: true,
        price: 95.0,
        slug: "phases-lune-fine-line-emma",
        altText: "Phases de lune fine line minimaliste",
        isFeatured: false,
        isVisible: true,
        viewCount: 345,
        likeCount: 78,
        instagramPostUrl: "https://instagram.com/p/emma_moon_cycle",
      },
      {
        artistId: emma?.id || artists[3]?.id,
        salonId: emma?.salonId,
        photo: "/images/tattoos/emma-constellation.jpg",
        description:
          "Constellation personnalisée avec points reliés. Minimalisme astronomique.",
        isFlash: false,
        price: null,
        slug: "constellation-personnalisee-emma",
        altText: "Constellation étoiles fine line tatouage",
        isFeatured: false,
        isVisible: true,
        viewCount: 234,
        likeCount: 45,
        instagramPostUrl: "https://instagram.com/p/emma_stars_align",
      },

      // Nina's chicano works (independent artist)
      {
        artistId: nina?.id || artists[4]?.id,
        salonId: null, // Independent artist
        photo: "/images/tattoos/nina-chicano-woman.jpg",
        description:
          "Portrait de femme style chicano avec roses et dentelles. Tradition latino-américaine.",
        isFlash: false,
        price: null,
        slug: "portrait-chicano-femme-nina",
        altText: "Portrait femme style chicano roses",
        isFeatured: true,
        isVisible: true,
        viewCount: 445,
        likeCount: 67,
        instagramPostUrl: "https://instagram.com/p/nina_chicano_queen",
      },
      {
        artistId: nina?.id || artists[4]?.id,
        salonId: null,
        photo: "/images/tattoos/nina-virgin-mary.jpg",
        description:
          "Vierge Marie style chicano traditionnel. Symbolisme religieux et technique impeccable.",
        isFlash: false,
        price: null,
        slug: "vierge-marie-chicano-nina",
        altText: "Vierge Marie chicano traditionnel tatouage",
        isFeatured: false,
        isVisible: true,
        viewCount: 289,
        likeCount: 43,
        instagramPostUrl: "https://instagram.com/p/nina_virgin_blessed",
      },

      // Additional works from other artists
      {
        artistId: artists[5]?.id || artists[0]?.id, // Scraped artist
        salonId: null,
        photo: "/images/tattoos/blackwork-tribal.jpg",
        description:
          "Motif tribal moderne en blackwork. Lignes épurées et contraste saisissant.",
        isFlash: true,
        price: 200.0,
        slug: "tribal-moderne-blackwork",
        altText: "Motif tribal blackwork moderne",
        isFeatured: false,
        isVisible: true,
        viewCount: 178,
        likeCount: 29,
        instagramPostUrl: "https://instagram.com/p/tribal_modern_ink",
      },
      {
        artistId: artists[6]?.id || artists[1]?.id, // Watercolor artist
        salonId: null,
        photo: "/images/tattoos/watercolor-butterfly.jpg",
        description:
          "Papillon aquarelle avec éclaboussures colorées. Technique fluide et organique.",
        isFlash: false,
        price: null,
        slug: "papillon-aquarelle-couleur",
        altText: "Papillon watercolor multicolore tatouage",
        isFeatured: false,
        isVisible: true,
        viewCount: 423,
        likeCount: 87,
        instagramPostUrl: "https://instagram.com/p/butterfly_watercolor_dreams",
      },
    ];

    // Create tattoos
    const createdTattoos = await Tattoo.createMany(tattoos);

    // Attach tags to tattoos (many-to-many relationships)
    const realismTag = tags.find((t) => t.slug === "realism");
    const traditionalTag = tags.find((t) => t.slug === "traditional");
    const geometricTag = tags.find((t) => t.slug === "geometric");
    const minimalistTag = tags.find((t) => t.slug === "minimalist");
    const watercolorTag = tags.find((t) => t.slug === "watercolor");
    const blackworkTag = tags.find((t) => t.slug === "blackwork");
    const brasTag = tags.find((t) => t.slug === "bras");
    const dosTag = tags.find((t) => t.slug === "dos");
    const animauxTag = tags.find((t) => t.slug === "animaux");
    const fleursTag = tags.find((t) => t.slug === "fleurs");
    const couleurTag = tags.find((t) => t.slug === "couleur");
    const noirGrisTag = tags.find((t) => t.slug === "noir-et-gris");

    // Attach tags to specific tattoos (examples)
    if (createdTattoos.length > 0) {
      // Alexandre's portraits - realism + black&grey + animals/portraits
      if (realismTag && noirGrisTag && animauxTag) {
        await createdTattoos[0]
          .related("tags")
          .attach([realismTag.id, noirGrisTag.id, brasTag?.id].filter(Boolean));
        await createdTattoos[1]
          .related("tags")
          .attach(
            [realismTag.id, noirGrisTag.id, animauxTag.id].filter(Boolean),
          );
      }

      // Sarah's neo-traditional + flowers + color
      if (traditionalTag && fleursTag && couleurTag) {
        await createdTattoos[2]
          .related("tags")
          .attach(
            [traditionalTag.id, fleursTag.id, couleurTag.id].filter(Boolean),
          );
        await createdTattoos[3]
          .related("tags")
          .attach(
            [traditionalTag.id, animauxTag?.id, couleurTag.id].filter(Boolean),
          );
      }

      // Marco's geometric work
      if (geometricTag) {
        await createdTattoos[4]
          .related("tags")
          .attach([geometricTag.id, dosTag?.id].filter(Boolean));
        await createdTattoos[5]
          .related("tags")
          .attach([geometricTag.id, brasTag?.id].filter(Boolean));
      }

      // Emma's minimalist work
      if (minimalistTag) {
        await createdTattoos[6]
          .related("tags")
          .attach([minimalistTag.id, fleursTag?.id].filter(Boolean));
        await createdTattoos[7]
          .related("tags")
          .attach([minimalistTag.id].filter(Boolean));
        await createdTattoos[8]
          .related("tags")
          .attach([minimalistTag.id].filter(Boolean));
      }

      // Other artists
      if (blackworkTag && watercolorTag) {
        await createdTattoos[10]
          .related("tags")
          .attach([blackworkTag.id].filter(Boolean));
        await createdTattoos[11]
          .related("tags")
          .attach(
            [watercolorTag.id, couleurTag?.id, animauxTag?.id].filter(Boolean),
          );
      }
    }

    console.log("✅ Tattoos seeded successfully with tag relationships");
  }
}

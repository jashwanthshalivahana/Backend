import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding products...");

  // Clear existing products
  await prisma.product.deleteMany();

  const products = [
    {
      name: "Multi-Strand Magenta Bead & Pearl Haram with Kundan Crescent Pendants",
      description:
        "5-strand magenta faceted glass bead necklace transitioning into faux pearl strands, with two crescent-shaped kundan-look pendants (green center stone) and flower-shaped kundan accents, finished with a pearl-bead connector.",
      price: 1800,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_1,1",
        "/images/product_1,2",
        "/images/product_1,3",
      ]),
      featured: true,
    },
    {
      name: "Multi-Strand Sunstone & Pearl Mala with Butterfly Motifs",
      description:
        "6-strand peach sunstone-look glass bead and faux pearl necklace with 5 moonstone-effect CZ butterfly charms cascading down one side (matching earrings shown).",
      price: 1500,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_2,1",
        "/images/product_2,2",
        "/images/product_2,3",
      ]),
      featured: true,
    },
    {
      name: "Multi-Strand Pearl Haram with Kundan Roundel Pendant",
      description:
        "5-strand faux pearl necklace with a circular kundan-look pendant (ruby and white stones), a ruby/emerald beaded connector section, and lower strands finished with gold filigree-look beads.",
      price: 1800,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_3,1",
        "/images/product_3,2",
        "/images/product_3,3",
      ]),
      featured: true,
    },
    {
      name: "Gold Bead Necklace with Ruby Drop Fringe",
      description:
        "Gold-plated ridged bead chain fully lined with small ruby-red glass teardrop drops (guttapusalu-inspired fringe style).",
      price: 900,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_4,1",
        "/images/product_4,2",
        "/images/product_4,3",
      ]),
      featured: false,
    },
    {
      name: "Delicate Chain Necklace with Ruby, Emerald & CZ Drops",
      description:
        "Fine gold-plated bead chain necklace with alternating ruby, emerald-green, and CZ round drop charms.",
      price: 550,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_5,1",
        "/images/product_5,2",
        "/images/product_5,3",
      ]),
      featured: false,
    },
    {
      name: "Delicate Chain Necklace with Ruby & CZ Drops",
      description:
        "Fine gold-plated bead chain necklace with alternating ruby-red teardrop and CZ round drop charms.",
      price: 500,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_6,1",
        "/images/product_6,2",
        "/images/product_6,3",
      ]),
      featured: false,
    },
    {
      name: "Black Bead Necklace with Kundan Flower Pendants",
      description:
        "Fine black glass bead necklace (nallapusalu style) with kundan-look flower charms featuring green center stones, spaced along the strand.",
      price: 700,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_7,1",
        "/images/product_7,2",
        "/images/product_7,3",
      ]),
      featured: false,
    },
    {
      name: "Black Bead Necklace with Kundan Lotus Pendant",
      description:
        "Black glass bead necklace (nallapusalu style) with a lotus-shaped kundan-look pendant (pink and green stones) finished with a pearl tassel fringe, plus two matching flower side-pendants.",
      price: 1100,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_8,1",
        "/images/product_8,2",
        "/images/product_8,3",
      ]),
      featured: true,
    },
    {
      name: "Black Bead Necklace with Kundan Roundels & Pearl Clusters",
      description:
        "Black glass bead necklace (nallapusalu style) with 5 kundan-look gold roundel pendants alternating with dangling faux pearl clusters.",
      price: 950,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_9,1",
        "/images/product_9,2",
        "/images/product_9,3",
      ]),
      featured: true,
    },
    {
      name: "Black Bead Necklace with Ruby Pendant & CZ Flower Drops",
      description:
        "Black glass bead necklace (nallapusalu style) with a ruby-red oval glass drop pendant surrounded by CZ, plus 4 small CZ flower charms.",
      price: 800,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_10,1",
        "/images/product_10,2",
        "/images/product_10,3",
      ]),
      featured: true,
    },
    {
      name: "Black Bead Choker with Pavé Accent Bead",
      description:
        "Fine black glass bead choker with a single gold-plated CZ pavé ball as the focal accent.",
      price: 550,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_11,1",
        "/images/product_11,2",
        "/images/product_11,3",
      ]),
      featured: false,
    },
    {
      name: "Magenta Bead Necklace with Pearl & Filigree Accents",
      description:
        "3-strand faceted magenta glass bead necklace with faux pearl spacers and gold-plated filigree focal beads at the center.",
      price: 650,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_12,1",
        "/images/product_12,2",
        "/images/product_12,3",
      ]),
      featured: false,
    },
    {
      name: "Pink Bead Necklace with CZ Flower Drops",
      description:
        "Long drape-style pink glass bead necklace with 8 gold-plated CZ flower charms spaced along both strands.",
      price: 750,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_13,1",
        "/images/product_13,2",
        "/images/product_13,3",
      ]),
      featured: false,
    },
    {
      name: "Magenta Bead Necklace with Pearl Accents",
      description:
        "3-strand faceted magenta glass bead necklace with faux pearl spacers and gold-plated filigree focal beads — companion piece to Magenta Bead Necklace with Pearl & Filigree Accents.",
      price: 650,
      category: "Necklaces",
      images: JSON.stringify([
        "/images/product_14,1",
        "/images/product_14,2",
        "/images/product_14,3",
      ]),
      featured: false,
    },
  ];

  for (const product of products) {
    const created = await prisma.product.create({ data: product });
    console.log(`  ✓ Created: ${created.name} (₹${created.price})`);
  }

  console.log(`\nSeeded ${products.length} products successfully.`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
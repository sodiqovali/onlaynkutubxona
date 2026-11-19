import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const entries = [
  { title: "O'tkan kunlar", slug: "otkan-kunlar", author: "Abdulla Qodiriy", category: "Klassika", categorySlug: "klassika", description: "O'zbek adabiyotining bebaho durdonasi. Otabek va Kumushning muhabbati orqali bir davr hayoti, orzu va armonlari hikoya qilinadi.", price: 2_900_000 },
  { title: "Mehrobdan chayon", slug: "mehrobdan-chayon", author: "Abdulla Qodiriy", category: "Klassika", categorySlug: "klassika", description: "Tarixiy muhit va insoniy jasorat haqida o'tkir qalam bilan yozilgan mashhur roman.", price: 2_500_000 },
  { title: "Ikki eshik orasi", slug: "ikki-eshik-orasi", author: "O'tkir Hoshimov", category: "Roman", categorySlug: "roman", description: "Urush yillaridagi inson taqdiri, mehr va matonat haqida ta'sirli qissa.", price: 3_200_000 },
  { title: "Shum bola", slug: "shum-bola", author: "G'afur G'ulom", category: "Sarguzasht", categorySlug: "sarguzasht", description: "Quvnoq va topqir Shum bolaning sarguzashtlari. Avlodlar sevib o'qiydigan asar.", price: 1_800_000 },
  { title: "Dunyoning ishlari", slug: "dunyoning-ishlari", author: "O'tkir Hoshimov", category: "Hikoya", categorySlug: "hikoya", description: "Ona mehri, bolalik xotiralari va kundalik hayot mo'jizalari haqida samimiy hikoyalar.", price: 2_200_000 },
  { title: "Alkimyogar", slug: "alkimyogar", author: "Paulo Coelho", category: "Jahon adabiyoti", categorySlug: "jahon-adabiyoti", description: "O'z orzusiga ergashgan cho'pon yigitning safar va o'zini anglash haqidagi falsafiy hikoyasi.", price: 3_500_000 },
  { title: "Sariq devni minib", slug: "sariq-devni-minib", author: "Xudoyberdi To'xtaboyev", category: "Sarguzasht", categorySlug: "sarguzasht", description: "Hoshimjonning sehrli va kulgili sarguzashtlari bolalar va kattalarga birdek manzur.", price: 2_400_000 },
  { title: "Atomic Habits", slug: "atomic-habits", author: "James Clear", category: "Shaxsiy rivojlanish", categorySlug: "shaxsiy-rivojlanish", description: "Kichik odatlar orqali katta o'zgarishlarga erishish bo'yicha amaliy qo'llanma.", price: 4_900_000 },
];

async function main() {
  for (const item of entries) {
    const category = await prisma.category.upsert({
      where: { slug: item.categorySlug },
      update: { name: item.category },
      create: { slug: item.categorySlug, name: item.category },
    });
    await prisma.book.upsert({
      where: { slug: item.slug },
      update: { title: item.title, author: item.author, description: item.description, priceInTiyin: item.price, categoryId: category.id },
      create: { title: item.title, slug: item.slug, author: item.author, description: item.description, priceInTiyin: item.price, categoryId: category.id, fileKey: `books/${item.slug}.pdf`, isPublished: true },
    });
  }
}

main().finally(async () => prisma.$disconnect());

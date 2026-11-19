export type Book = {
  id: string;
  title: string;
  author: string;
  category: string;
  description: string;
  price: number;
  cover: string;
  color: string;
  badge?: string;
  rating: string;
};

// Temporary presentation data. Production catalog will come from PostgreSQL.
export const books: Book[] = [
  { id: "1", title: "O'tkan kunlar", author: "Abdulla Qodiriy", category: "Klassika", description: "O'zbek adabiyotining bebaho durdonasi. Otabek va Kumushning muhabbati orqali bir davr hayoti, orzu va armonlari hikoya qilinadi.", price: 29000, cover: "📕", color: "#e9d5c3", badge: "Mumtoz asar", rating: "4.9" },
  { id: "2", title: "Mehrobdan chayon", author: "Abdulla Qodiriy", category: "Klassika", description: "Tarixiy muhit va insoniy jasorat haqida o'tkir qalam bilan yozilgan mashhur roman.", price: 25000, cover: "📙", color: "#ead6b2", rating: "4.8" },
  { id: "3", title: "Ikki eshik orasi", author: "O'tkir Hoshimov", category: "Roman", description: "Urush yillaridagi inson taqdiri, mehr va matonat haqida ta'sirli qissa.", price: 32000, cover: "📗", color: "#d5dfca", badge: "Ko'p o'qilgan", rating: "5.0" },
  { id: "4", title: "Shum bola", author: "G'afur G'ulom", category: "Sarguzasht", description: "Quvnoq va topqir Shum bolaning sarguzashtlari. Avlodlar sevib o'qiydigan asar.", price: 18000, cover: "📘", color: "#cad9e4", rating: "4.7" },
  { id: "5", title: "Dunyoning ishlari", author: "O'tkir Hoshimov", category: "Hikoya", description: "Ona mehri, bolalik xotiralari va kundalik hayot mo'jizalari haqida samimiy hikoyalar.", price: 22000, cover: "📔", color: "#e8c9c1", badge: "Tavsiya", rating: "4.9" },
  { id: "6", title: "Alkimyogar", author: "Paulo Coelho", category: "Jahon adabiyoti", description: "O'z orzusiga ergashgan cho'pon yigitning safar va o'zini anglash haqidagi falsafiy hikoyasi.", price: 35000, cover: "📒", color: "#e8dfbb", rating: "4.8" },
  { id: "7", title: "Sariq devni minib", author: "Xudoyberdi To'xtaboyev", category: "Sarguzasht", description: "Hoshimjonning sehrli va kulgili sarguzashtlari bolalar va kattalarga birdek manzur.", price: 24000, cover: "📕", color: "#e7d0a5", rating: "4.9" },
  { id: "8", title: "Atomic Habits", author: "James Clear", category: "Shaxsiy rivojlanish", description: "Kichik odatlar orqali katta o'zgarishlarga erishish bo'yicha amaliy qo'llanma.", price: 49000, cover: "📘", color: "#d1dce4", rating: "4.8" },
];

export const categories = ["Barchasi", "Klassika", "Roman", "Sarguzasht", "Hikoya", "Jahon adabiyoti", "Shaxsiy rivojlanish"];

export function formatPrice(amount: number) {
  return `${new Intl.NumberFormat("uz-UZ").format(amount)} so'm`;
}

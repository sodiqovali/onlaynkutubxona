# Kitobzor — onlayn kutubxona

O'zbek tilidagi elektron kitoblar uchun MVP interfeysi va backend poydevori.

## Ishga tushirish

1. Node.js 20+ o'rnating.
2. `npm install`
3. `.env.example` faylidan `.env` yarating va PostgreSQL ulanish manzilini kiriting.
4. `npx prisma generate` va `npx prisma migrate dev --name init` ni bajaring.
5. `npm run db:seed` bilan demo katalogni bazaga kiriting.
6. `npm run dev` bilan ishga tushiring.

## Admin panel — lokal MVP

- `http://localhost:3000/admin` manzilini oching.
- Admin parolini `.env.local` faylidagi `ADMIN_PASSWORD` qiymatidan oling. Deploydan oldin kuchli yangi parol belgilang.
- Kitob nomi, muallif, turkum, tavsif, narx, til, nashr yili va PDF/EPUB faylini kiriting.
- Kitob ma'lumotlari `.data/books.json` faylida, fayllar `.private/books` papkasida saqlanadi. Bu papkalar Git'ga kirmaydi.
- Nashr qilingan kitoblar bosh sahifadagi katalogda ko'rinadi. Kiritilgan narx katalogda va kitob tafsilotida ko'rsatiladi.
- Haqiqiy to'lov va xariddan keyingi yuklab olish hali ulanmagan. Fayllar serverdagi private papkada saqlanadi.
- `.env.local` dagi `APP_SECRET` ni deploydan oldin yangi tasodifiy kalitga almashtiring.

## Arxitektura

- `src/app`: Next.js App Router sahifalari va server route'lari.
- `src/lib`: admin autentifikatsiyasi, mahalliy katalog va Prisma ulanishi.
- `prisma/schema.prisma`: foydalanuvchi, katalog, buyurtma va to'lov holati modellari.
- `src/app/api/admin`: admin login, logout va katalogga kitob qo'shish API'lari.
- `src/app/api/catalog`: faqat nashr qilingan mahalliy kitoblar uchun ommaviy katalog.
- Ishlab chiqarishda katalog PostgreSQL'dan, fayllar esa private S3/R2 omboridan berilishi kerak.

Admin login cookie'si HTTP-only, same-site va 8 soat amal qiladi.

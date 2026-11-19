import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/admin-auth";
import { readLocalBooks, writeLocalBooks, type LocalBook } from "@/lib/local-books";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_FILE_SIZE = 30 * 1024 * 1024;

export async function GET() {
  if (!await isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  try { return NextResponse.json({ data: await readLocalBooks() }); }
  catch { return NextResponse.json({ error: "Kitoblar ro'yxatini o'qib bo'lmadi" }, { status: 500 }); }
}

export async function POST(request: Request) {
  if (!await isAdmin()) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 });
  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const author = String(form.get("author") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  const category = String(form.get("category") ?? "").trim();
  const language = String(form.get("language") ?? "uz").trim();
  const price = Number(form.get("price"));
  const yearValue = String(form.get("year") ?? "").trim();
  const year = yearValue ? Number(yearValue) : null;
  const coverValue = String(form.get("coverUrl") ?? "").trim();
  const coverUrl = coverValue || null;
  const file = form.get("file");

  if (!title || !author || !description || !category || !Number.isSafeInteger(price) || price < 0 || price > 2_000_000_000) {
    return NextResponse.json({ error: "Majburiy maydonlarni tekshiring. Narx butun so'mda kirtiladi." }, { status: 400 });
  }
  if (year !== null && (!Number.isInteger(year) || year < 1000 || year > new Date().getFullYear())) {
    return NextResponse.json({ error: "Nashr yilini tekshiring" }, { status: 400 });
  }
  if (coverUrl && (!coverUrl.startsWith("https://") || coverUrl.length > 2048)) {
    return NextResponse.json({ error: "Muqova manzili https:// bilan boshlanishi kerak" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) return NextResponse.json({ error: "PDF yoki EPUB faylni tanlang" }, { status: 400 });
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "Fayl hajmi 30 MB dan oshmasin" }, { status: 413 });
  const extension = path.extname(file.name).toLowerCase();
  const allowedTypes: Record<string, string[]> = { ".pdf": ["application/pdf"], ".epub": ["application/epub+zip", "application/zip", "application/octet-stream"] };
  if (!allowedTypes[extension]?.includes(file.type)) return NextResponse.json({ error: "Faqat PDF yoki EPUB kitob qabul qilinadi" }, { status: 415 });

  const id = randomUUID();
  const storedName = `${id}${extension}`;
  const storageDir = path.join(process.cwd(), ".private", "books");
  const bytes = Buffer.from(await file.arrayBuffer());
  if (extension === ".pdf" && (bytes.length < 5 || bytes.subarray(0, 5).toString() !== "%PDF-")) {
    return NextResponse.json({ error: "Tanlangan fayl haqiqiy PDF emas" }, { status: 415 });
  }
  try {
    await mkdir(storageDir, { recursive: true });
    await writeFile(path.join(storageDir, storedName), bytes, { flag: "wx" });
    const existing = await readLocalBooks();
    const base = title.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || id;
    const slug = existing.some((book) => book.slug === base) ? `${base}-${id.slice(0, 6)}` : base;
    const categorySlug = category.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const book: LocalBook = { id, title, slug, author, description, category, categorySlug, price, language, year, coverUrl, fileName: file.name.slice(0, 180), fileKey: storedName, fileSize: file.size, published: form.get("published") === "on", createdAt: new Date().toISOString() };
    await writeLocalBooks([book, ...existing]);
    return NextResponse.json({ data: book }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Saqlash amalga oshmadi. Serverdagi disk va .data papkasini tekshiring." }, { status: 500 });
  }
}

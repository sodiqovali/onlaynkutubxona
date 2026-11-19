import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const category = searchParams.get("category")?.trim();

  try {
    const books = await prisma.book.findMany({
      where: {
        isPublished: true,
        ...(category ? { category: { slug: category } } : {}),
        ...(query ? { OR: [
          { title: { contains: query, mode: "insensitive" } },
          { author: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ] } : {}),
      },
      select: {
        id: true, title: true, slug: true, author: true, description: true,
        coverUrl: true, priceInTiyin: true, currency: true, publishedYear: true,
        language: true, pageCount: true, category: { select: { name: true, slug: true } },
      },
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ data: books });
  } catch {
    return NextResponse.json({ error: "Kitoblar bazasiga ulanib bo'lmadi" }, { status: 503 });
  }
}

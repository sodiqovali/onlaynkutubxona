import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const book = await prisma.book.findFirst({
      where: { slug, isPublished: true },
      select: {
        id: true, title: true, slug: true, author: true, description: true,
        coverUrl: true, priceInTiyin: true, currency: true, publishedYear: true,
        language: true, pageCount: true, category: { select: { name: true, slug: true } },
      },
    });
    if (!book) return NextResponse.json({ error: "Kitob topilmadi" }, { status: 404 });
    return NextResponse.json({ data: book });
  } catch {
    return NextResponse.json({ error: "Kitobni yuklashda xatolik" }, { status: 503 });
  }
}

import { NextResponse } from "next/server";
import { readLocalBooks } from "@/lib/local-books";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const books = await readLocalBooks();
    return NextResponse.json({ data: books.filter((book) => book.published).map(({ fileKey: _fileKey, fileName: _fileName, fileSize: _fileSize, ...book }) => book) });
  } catch {
    return NextResponse.json({ error: "Katalogni yuklab bo'lmadi" }, { status: 503 });
  }
}

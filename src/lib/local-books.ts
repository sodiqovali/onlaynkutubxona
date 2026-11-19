import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type LocalBook = {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  category: string;
  categorySlug: string;
  price: number;
  language: string;
  year: number | null;
  coverUrl: string | null;
  fileName: string;
  fileKey: string;
  fileSize: number;
  published: boolean;
  createdAt: string;
};

const dataDir = path.join(process.cwd(), ".data");
const filePath = path.join(dataDir, "books.json");

export async function readLocalBooks(): Promise<LocalBook[]> {
  try {
    const parsed: unknown = JSON.parse(await readFile(filePath, "utf8"));
    return Array.isArray(parsed) ? parsed as LocalBook[] : [];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

export async function writeLocalBooks(books: LocalBook[]) {
  await mkdir(dataDir, { recursive: true });
  const temporary = `${filePath}.tmp`;
  await writeFile(temporary, JSON.stringify(books, null, 2), "utf8");
  await rename(temporary, filePath);
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kitobzor — kitoblar olami",
  description: "Sevimli kitoblaringizni toping va bir necha soniyada o'qishni boshlang.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uz"><body>{children}</body></html>;
}

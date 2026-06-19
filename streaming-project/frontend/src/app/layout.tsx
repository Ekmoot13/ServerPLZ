import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Streaming Regat",
  description: "Platforma transmisji video z regat",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col">
        <header className="bg-brand-900 text-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold tracking-tight hover:text-blue-300 transition-colors">
              Regaty Live
            </Link>
            <nav className="flex gap-6 text-sm font-medium">
              <Link href="/" className="hover:text-blue-300 transition-colors">
                Transmisje
              </Link>
              <Link href="/events" className="hover:text-blue-300 transition-colors">
                Wyniki
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        <footer className="bg-slate-800 text-slate-400 text-center text-xs py-4">
          Regaty Live &copy; {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}

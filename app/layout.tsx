import type { Metadata } from 'next';
import './globals.css';
import { BookProvider } from '@/context/BookContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'ShelfLife - Track Your Personal Book Shelf',
  description: 'A personal reading tracker to organize books you are reading, have read, and finished.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased" suppressHydrationWarning>
        <BookProvider>
          <Header />
          <main className="max-w-6xl mx-auto p-4 sm:p-6">{children}</main>
        </BookProvider>
      </body>
    </html>
  );
}

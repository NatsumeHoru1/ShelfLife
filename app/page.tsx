'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBook } from '@/context/BookContext';

export default function HomePage() {
  const { user } = useBook();

  return (
    <div className="py-12 flex flex-col items-center text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full mb-4">
        📖 Your Personal Library Companion
      </div>
      <h1 data-testid="home-title" className="text-5xl font-black tracking-tight text-slate-900 mb-4">
        Shelf<span className="text-emerald-600">Life</span>
      </h1>
      <p className="text-lg text-slate-600 max-w-xl mb-8 leading-relaxed">
        A personal web app where you record the books on your shelf, log pages, and track your reading lifecycle from start to finish.
      </p>

      <div className="mb-12">
        <Link href={user ? '/books' : '/login'}>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-6 text-base rounded-xl shadow-md">
            {user ? 'Go to My Shelf →' : 'Start Organizing Your Shelf →'}
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xl mb-2">
              📚
            </div>
            <CardTitle className="text-xl">Add Books to Shelf</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Record titles (up to 80 chars), authors (up to 60 chars), and total page counts (1 to 5,000 pages).
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xl mb-2">
              🔖
            </div>
            <CardTitle className="text-xl">Lifecycle Status</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Easily categorize each book as <span className="font-semibold text-slate-800">Reading</span>, <span className="font-semibold text-slate-800">Read</span>, or <span className="font-semibold text-slate-800">Finished</span>.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="border-slate-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-xl mb-2">
              🔒
            </div>
            <CardTitle className="text-xl">Private & Secured</CardTitle>
            <CardDescription className="text-sm text-slate-600">
              Every book belongs only to you, protected by Supabase Row Level Security (RLS).
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

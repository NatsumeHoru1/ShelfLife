'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useBook } from '@/context/BookContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { user, logout, loadingUser } = useBook();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="border-b bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-50">
      <Link href="/" className="text-2xl font-black tracking-tight text-slate-900 flex items-center gap-2">
        <span className="text-emerald-600">📚</span>
        <span>Shelf<span className="text-emerald-600">Life</span></span>
      </Link>

      <div className="flex items-center gap-4">
        {!loadingUser && (
          <>
            {user ? (
              <>
                <span data-testid="user-email" className="text-sm font-medium text-slate-600 hidden sm:inline-block">
                  {user.email}
                </span>
                <Link href="/books" data-testid="link-books" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                  My Shelf
                </Link>
                <Button data-testid="btn-logout" variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button data-testid="btn-login" variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="btn-register" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </header>
  );
}

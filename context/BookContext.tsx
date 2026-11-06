'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: 'read' | 'reading' | 'finished';
  created_at: string;
}

interface BookContextType {
  user: User | null;
  loadingUser: boolean;
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'user_id' | 'created_at'>) => Promise<{ error?: any }>;
  updateBookStatus: (id: string, status: 'read' | 'reading' | 'finished') => Promise<{ error?: any }>;
  updateBook: (id: string, updates: Partial<Omit<Book, 'id' | 'user_id' | 'created_at'>>) => Promise<{ error?: any }>;
  deleteBook: (id: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [books, setBooks] = useState<Book[]>([]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setBooks(data as Book[]);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchBooks();
      setLoadingUser(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchBooks();
      } else {
        setBooks([]);
      }
      setLoadingUser(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const addBook = async (newBook: Omit<Book, 'id' | 'user_id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('books')
      .insert([newBook])
      .select();
    if (error) return { error };
    if (data && data.length > 0) {
      setBooks((prev) => [data[0] as Book, ...prev]);
    }
    return {};
  };

  const updateBookStatus = async (id: string, status: 'read' | 'reading' | 'finished') => {
    const { data, error } = await supabase
      .from('books')
      .update({ status })
      .eq('id', id)
      .select();
    if (error) return { error };
    if (data && data.length > 0) {
      setBooks((prev) => prev.map((b) => (b.id === id ? (data[0] as Book) : b)));
    }
    return {};
  };

  const updateBook = async (id: string, updates: Partial<Omit<Book, 'id' | 'user_id' | 'created_at'>>) => {
    const { data, error } = await supabase
      .from('books')
      .update(updates)
      .eq('id', id)
      .select();
    if (error) return { error };
    if (data && data.length > 0) {
      setBooks((prev) => prev.map((b) => (b.id === id ? (data[0] as Book) : b)));
    }
    return {};
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from('books').delete().eq('id', id);
    if (!error) {
      setBooks((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setBooks([]);
  };

  return (
    <BookContext.Provider
      value={{
        user,
        loadingUser,
        books,
        addBook,
        updateBookStatus,
        updateBook,
        deleteBook,
        logout,
        fetchBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export const useBook = () => {
  const context = useContext(BookContext);
  if (!context) throw new Error('useBook must be used within BookProvider');
  return context;
};

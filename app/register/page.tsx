'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const trimmedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: trimmedEmail,
      password,
    });

    setLoading(false);

    if (error) {
      if (
        error.message.toLowerCase().includes('already registered') ||
        error.message.toLowerCase().includes('already in use') ||
        error.message.toLowerCase().includes('user already exists')
      ) {
        setError('Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng email khác.');
      } else {
        setError(error.message);
      }
    } else if (data?.user && data.user.identities && data.user.identities.length === 0) {
      setError('Email này đã được đăng ký tài khoản trước đó. Vui lòng đăng nhập!');
    } else {
      if (data?.session) {
        router.push('/books');
      } else {
        setSuccess('Đăng ký thành công! Bạn có thể chuyển sang trang Đăng nhập.');
      }
    }
  };

  return (
    <div className="py-12 flex justify-center">
      <Card className="w-full max-w-md border-slate-200 shadow-sm">
        <CardHeader className="text-center">
          <div className="text-3xl mb-1">📖</div>
          <CardTitle className="text-2xl font-black text-slate-900">Create an Account</CardTitle>
          <CardDescription className="text-sm text-slate-600">
            Join ShelfLife to start tracking your reading journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label htmlFor="reg-email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="reg-password" className="text-xs font-bold text-slate-700">Password</Label>
              <Input
                id="reg-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="confirm-password" className="text-xs font-bold text-slate-700">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-type password"
                className="mt-1"
              />
            </div>

            {error && (
              <p className="text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded border border-red-200">
                {error}
              </p>
            )}

            {success && (
              <p className="text-xs font-medium text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                {success}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              {loading ? 'Creating account...' : 'Register'}
            </Button>

            <p className="text-center text-xs text-slate-500 mt-4">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-emerald-600 hover:underline">
                Log in here
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

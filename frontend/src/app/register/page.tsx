'use client';

import { useState } from 'react';
import { Music2, Lock, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      addToast('Passwords do not match.', 'error');
      return;
    }
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast('Account created successfully. Please log in.', 'success');
        router.push('/login');
      } else {
        const msg = data.message || 'Registration failed.';
        setError(msg);
        addToast(msg, 'error');
      }
    } catch {
      setError('Could not connect to server.');
      addToast('Could not connect to server.', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <Music2 className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Create an account</h1>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-zinc-400 mb-1.5">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="username"
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-400 mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Log In
          </Link>
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, LogIn, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';

export default function AccountMenu() {
  const router = useRouter();
  const { addToast } = useToast();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ username: string; isAdmin: boolean } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('http://localhost:3001/auth/me', { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => { if (data) setUser(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await fetch('http://localhost:3001/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    setOpen(false);
    addToast('Logged out successfully.', 'success');
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
      >
        <UserCircle className="w-6 h-6 text-zinc-300" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl py-1 z-50">
          {user ? (
            <>
              <div className="px-4 py-2 border-b border-zinc-700">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
              </div>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Log In
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

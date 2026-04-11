'use client';

import { useState, useRef, useEffect } from 'react';
import { UserCircle, LogIn, LogOut, Shield } from 'lucide-react';
import { Link } from 'next-view-transitions';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { useUser } from '@/context/UserContext';

export default function AccountMenu() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user, refreshUser } = useUser();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3001'}/auth/logout`, { method: 'POST', credentials: 'include' }).catch(() => {});
    setOpen(false);
    addToast('Logged out successfully.', 'success');
    await refreshUser();
    router.push('/');
    router.refresh();
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-purple-500/20"
      >
        <UserCircle className="w-6 h-6 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-[#1E1E1E] border border-white/10 rounded-none shadow-xl py-1 z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-white/5">
                <p className="text-sm font-medium text-white truncate">{user.username}</p>
              </div>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Shield className="w-4 h-4 text-purple-400" />
                  Admin Panel
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
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

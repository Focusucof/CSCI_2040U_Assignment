'use client';

import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function AccountMenu() {
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
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Log In
          </Link>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-16 flex items-center gap-4 px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      {/* Navigation arrows */}
      <div className="flex gap-2">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Go back"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M11 1L4 8l7 7" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </button>
        <button
          onClick={() => router.forward()}
          className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center hover:bg-black/70 transition-colors"
          aria-label="Go forward"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M5 1l7 7-7 7" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </button>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex-1 max-w-md">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full bg-surface-light text-white text-sm rounded-full pl-10 pr-4 py-2.5 placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>
      </form>

      {/* Mobile menu button */}
      <button className="md:hidden w-8 h-8 flex items-center justify-center" aria-label="Menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
        </svg>
      </button>
    </header>
  );
}

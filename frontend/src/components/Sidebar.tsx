'use client';

import React from 'react';
import { Link } from 'next-view-transitions';
import { usePathname } from 'next/navigation';
import { Home, Search, Library, PlusSquare, Heart, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Search, label: 'Search', href: '/search' },
  { icon: Library, label: 'Your Library', href: '/library' },
];

const playlists = [
  'Chill Lo-fi Beats',
  'Deep Focus',
  'Night Drive',
  'Workout Energy',
  'Acoustic Mornings',
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0a0a0a] flex flex-col h-full border-r border-white/5">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-none flex items-center justify-center shadow-lg shadow-purple-500/20">
            <Music2 className="text-white w-5 h-5" />
          </Link>
          <Link href="/" className="text-xl font-bold gradient-text">Streamly</Link>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === '/search' && pathname.startsWith('/search'));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 w-full px-4 py-3 rounded-none transition-all duration-200 text-sm font-medium",
                  isActive 
                    ? "bg-white/10 text-white border border-white/10" 
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 space-y-2">
          <button className="flex items-center gap-4 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-none transition-all duration-200 text-sm font-medium">
            <PlusSquare className="w-5 h-5" />
            Create Playlist
          </button>
          <button className="flex items-center gap-4 w-full px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-none transition-all duration-200 text-sm font-medium">
            <Heart className="w-5 h-5" />
            Liked Songs
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Playlists
          </p>
          <div className="space-y-1 overflow-y-auto max-h-[300px] pr-2">
            {playlists.map((playlist) => (
              <button
                key={playlist}
                className="block w-full text-left px-4 py-2.5 text-sm text-zinc-400 hover:text-white hover:bg-white/5 rounded-none transition-all duration-200 truncate"
              >
                {playlist}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

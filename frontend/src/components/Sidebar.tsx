'use client';

import React from 'react';
import { Home, Search, Library, PlusSquare, Heart, Mic2, Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: Search, label: 'Search' },
  { icon: Library, label: 'Your Library' },
];

const playlists = [
  'Chill Lo-fi Beats',
  'Deep Focus',
  'Night Drive',
  'Workout Energy',
  'Acoustic Mornings',
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-black flex flex-col h-full border-r border-zinc-800">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Music2 className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">Echo</span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={cn(
                "flex items-center gap-4 w-full px-3 py-2 rounded-md transition-colors text-sm font-medium",
                item.active ? "bg-zinc-900 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-4">
          <button className="flex items-center gap-4 w-full px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <PlusSquare className="w-5 h-5" />
            Create Playlist
          </button>
          <button className="flex items-center gap-4 w-full px-3 py-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium">
            <Heart className="w-5 h-5" />
            Liked Songs
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800">
          <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
            Playlists
          </p>
          <div className="space-y-1 overflow-y-auto max-h-[300px] pr-2">
            {playlists.map((playlist) => (
              <button
                key={playlist}
                className="block w-full text-left px-3 py-2 text-sm text-zinc-400 hover:text-white transition-colors truncate"
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

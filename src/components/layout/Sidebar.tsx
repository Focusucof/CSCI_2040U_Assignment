'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLibrary } from '@/context/LibraryContext';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/search', label: 'Search', icon: SearchIcon },
  { href: '/browse', label: 'Browse', icon: BrowseIcon },
];

const libraryItems = [
  { href: '/favorites', label: 'Liked Songs', icon: HeartIcon },
  { href: '/playlists', label: 'Playlists', icon: PlaylistIcon },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { playlists } = useLibrary();

  return (
    <aside className="w-60 bg-black flex flex-col h-full shrink-0 max-md:hidden">
      {/* Logo */}
      <div className="p-6 pb-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
            <span className="text-black font-bold text-sm">M</span>
          </div>
          <span className="text-xl font-bold">Music</span>
        </Link>
      </div>

      {/* Main Nav */}
      <nav className="px-3 space-y-1">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors',
              pathname === item.href
                ? 'text-white bg-surface-light'
                : 'text-muted hover:text-white'
            )}
          >
            <item.icon active={pathname === item.href} />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Library */}
      <div className="mt-6 px-3">
        <h3 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-dark">
          Your Library
        </h3>
        <nav className="space-y-1">
          {libraryItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors',
                pathname === item.href
                  ? 'text-white bg-surface-light'
                  : 'text-muted hover:text-white'
              )}
            >
              <item.icon active={pathname === item.href} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* User Playlists */}
      <div className="mt-4 px-3 flex-1 overflow-y-auto">
        <div className="border-t border-surface-light pt-4">
          {playlists.map(playlist => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className={cn(
                'block px-3 py-1.5 text-sm truncate transition-colors',
                pathname === `/playlist/${playlist.id}`
                  ? 'text-white'
                  : 'text-muted hover:text-white'
              )}
            >
              {playlist.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}

// Simple SVG icons
function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'white' : 'currentColor'}>
      <path d="M12 3l10 9h-3v9h-5v-6H10v6H5v-9H2l10-9z" />
    </svg>
  );
}

function SearchIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={active ? 'white' : 'currentColor'} strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

function BrowseIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'white' : 'currentColor'}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function HeartIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? '#1DB954' : 'none'} stroke={active ? '#1DB954' : 'currentColor'} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function PlaylistIcon({ active }: { active: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? 'white' : 'currentColor'}>
      <path d="M3 6h18v2H3V6zm0 5h12v2H3v-2zm0 5h18v2H3v-2z" />
    </svg>
  );
}

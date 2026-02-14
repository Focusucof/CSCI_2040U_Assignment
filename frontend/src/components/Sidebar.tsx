"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Library, Heart, ListMusic, Disc3 } from "lucide-react";
import { motion } from "framer-motion";
import { playlists } from "@/data/mock";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/search", label: "Search", icon: Search },
  { href: "/library", label: "Library", icon: Library },
  { href: "/liked", label: "Liked Songs", icon: Heart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 bottom-[88px] w-[260px] bg-surface/60 backdrop-blur-xl border-r border-border flex flex-col z-30">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center">
            <Disc3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-foreground">
            Aurion
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="px-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors relative ${
                  active
                    ? "text-foreground bg-accent-muted"
                    : "text-muted hover:text-foreground hover:bg-surface-hover"
                }`}
                whileHover={{ x: 2 }}
                transition={{ duration: 0.15 }}
              >
                {active && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <item.icon className={`w-[18px] h-[18px] ${active ? "text-accent" : ""}`} />
                {item.label}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Playlists */}
      <div className="mt-6 px-3 flex-1 overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted">
            Playlists
          </span>
          <ListMusic className="w-3.5 h-3.5 text-muted" />
        </div>
        <div className="flex-1 overflow-y-auto space-y-0.5">
          {playlists.map((pl) => {
            const active = pathname === `/playlist/${pl.id}`;
            return (
              <Link key={pl.id} href={`/playlist/${pl.id}`}>
                <div
                  className={`px-3 py-2 rounded-lg text-sm truncate transition-colors ${
                    active
                      ? "text-foreground bg-accent-muted"
                      : "text-muted hover:text-foreground hover:bg-surface-hover"
                  }`}
                >
                  {pl.name}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

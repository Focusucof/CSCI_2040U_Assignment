"use client";

import Sidebar from "./Sidebar";
import NowPlaying from "./NowPlaying";
import AlbumFlyout from "./AlbumFlyout";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="ml-[260px] pb-[88px] h-screen overflow-y-auto">
        {children}
      </main>
      <NowPlaying />
      <AlbumFlyout />
    </>
  );
}

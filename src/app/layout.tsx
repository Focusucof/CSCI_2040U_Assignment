import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/context/Providers';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import NowPlayingBar from '@/components/layout/NowPlayingBar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Music Library',
  description: 'A Spotify-inspired music catalogue app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <div className="h-screen flex flex-col overflow-hidden">
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <main className="flex-1 overflow-y-auto">
                <Header />
                <div className="p-6">
                  {children}
                </div>
              </main>
            </div>
            <NowPlayingBar />
          </div>
        </Providers>
      </body>
    </html>
  );
}

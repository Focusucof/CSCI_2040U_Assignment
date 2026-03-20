import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ViewTransitions } from 'next-view-transitions';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Streamly | Music Discovery',
  description: 'AI-powered music discovery platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body suppressHydrationWarning className="bg-vibrant text-zinc-100 font-sans antialiased">
        <ToastProvider>
          <ViewTransitions>
            {children}
          </ViewTransitions>
        </ToastProvider>
      </body>
    </html>
  );
}

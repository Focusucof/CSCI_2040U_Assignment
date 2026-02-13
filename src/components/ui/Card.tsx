'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  href: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  rounded?: boolean;
}

export default function Card({ href, imageUrl, title, subtitle, rounded = false }: CardProps) {
  return (
    <Link
      href={href}
      className="bg-surface hover:bg-surface-hover p-4 rounded-lg transition-all duration-200 group block"
    >
      <div className={`relative aspect-square mb-4 overflow-hidden shadow-lg ${rounded ? 'rounded-full' : 'rounded-md'}`}>
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
        />
        {/* Play button overlay */}
        <div className="absolute bottom-2 right-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200">
          <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-sm font-semibold truncate">{title}</h3>
      <p className="text-xs text-muted mt-1 truncate">{subtitle}</p>
    </Link>
  );
}

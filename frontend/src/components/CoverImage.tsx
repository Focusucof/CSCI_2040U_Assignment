'use client';

import Image from 'next/image';
import { Music } from 'lucide-react';

interface CoverImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  sizes?: string;
}

export default function CoverImage({ src, alt, className = '', sizes = '40px' }: CoverImageProps) {
  if (!src || src.trim() === '') {
    return (
      <div className={`relative flex items-center justify-center bg-[#252525] ${className}`}>
        <Music className="w-1/3 h-1/3 text-zinc-500" />
      </div>
    );
  }

  const BACKEND_URL = 'http://localhost:8080';
  const fullUrl = src.startsWith('http') ? src : BACKEND_URL + (src.startsWith('/') ? '' : '/') + src;

  return (
    <Image
      src={fullUrl}
      alt={alt}
      fill
      className={`object-cover ${className}`}
      sizes={sizes}
      referrerPolicy="no-referrer"
    />
  );
}
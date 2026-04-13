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
        <Image
          src="/placeholder-music.svg"
          alt={alt}
          fill
          className={`object-cover ${className}`}
          sizes={sizes}
        />
      </div>
    );
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
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
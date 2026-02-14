"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  href?: string;
}

export default function SectionHeader({ title, href }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors"
        >
          See all
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </div>
  );
}

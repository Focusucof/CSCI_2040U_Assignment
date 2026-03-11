import React from 'react';

interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

export default function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <button className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors">
        Show all
      </button>
    </div>
  );
}

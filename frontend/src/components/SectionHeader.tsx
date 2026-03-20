interface SectionHeaderProps {
  icon: React.ElementType;
  title: string;
}

export default function SectionHeader({ icon: Icon, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4 gradient-border pb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-purple-400" />
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <button className="text-sm font-semibold text-zinc-400 hover:text-purple-300 transition-colors">
        Show all
      </button>
    </div>
  );
}

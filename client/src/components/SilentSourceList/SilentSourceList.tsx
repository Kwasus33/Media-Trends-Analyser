import { SearchX } from 'lucide-react';
import { type Source, getSourceConfig } from '@/constants/sources';

type SilentSourceListProps = {
  sources: Source[];
  label: React.ReactNode;
};

export function SilentSourceList({ sources, label }: SilentSourceListProps) {
  if (sources.length === 0) return null;

  return (
    <div className="w-full rounded-xl border border-white/5 border-dashed bg-black/20 p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex items-center gap-3 shrink-0 opacity-70">
        <SearchX className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-400 font-medium">{label}</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {sources.map((source) => {
          const config = getSourceConfig(source);

          return (
            <div
              key={source}
              className={`
                px-2.5 py-1 rounded text-xs font-medium border bg-black/30 flex items-center gap-1.5
                ${config.border} opacity-80 hover:opacity-100 transition-opacity
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${config.bg.replace(
                  'bg-',
                  'bg-current '
                )} ${config.color}`}
              />
              <span className={config.color}>{source}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

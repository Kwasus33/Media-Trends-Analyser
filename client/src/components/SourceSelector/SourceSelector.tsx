import { getSourceConfig, type Source } from '@/constants/sources';
import { Globe } from 'lucide-react';

type SourceSelectorProps = {
  source: Source;
  checked: boolean;
  onChange: () => void;
};

export function SourceSelector({
  source,
  checked,
  onChange,
}: SourceSelectorProps) {
  const { icon, region, abbreviation } = getSourceConfig(source);

  return (
    <button
      onClick={onChange}
      className={`
        relative flex flex-col items-center w-28 h-24 rounded-xl border-2 transition-all duration-300 pb-3
        ${
          checked
            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
            : 'border-gray-800 bg-gray-900/40 hover:border-gray-600 hover:bg-gray-900/80'
        }
      `}
    >
      {region === 'global' && (
        <Globe
          className={`absolute top-2 right-2 w-3.5 h-3.5 transition-colors ${
            checked ? 'text-indigo-300' : 'text-gray-600'
          }`}
        />
      )}

      {region === 'pl' && (
        <svg
          viewBox="0 0 10 10"
          className={`absolute top-2 right-2 w-3.5 h-3.5 rounded-full ${
            checked ? 'opacity-100' : 'opacity-60 grayscale'
          }`}
        >
          <path d="M0 0h10v5H0z" fill="#fff" />
          <path d="M0 5h10v5H0z" fill="#DC143C" />
        </svg>
      )}

      <div
        className={`flex-1 flex items-center justify-center w-full transition-all duration-300 ${
          checked ? 'opacity-100 scale-110' : 'opacity-60 grayscale scale-100'
        }`}
      >
        {icon}
      </div>

      <span
        className={`text-xs font-medium tracking-wide transition-colors ${
          checked ? 'text-indigo-200' : 'text-gray-500'
        }`}
      >
        {abbreviation ?? source}
      </span>
    </button>
  );
}

import {
  MessageCircle,
  Rss,
  Globe,
  Newspaper,
  Radio,
  type LucideProps,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SectionWrapper } from '@/components/SectionWrapper';

type Highlights = {
  [key: string]: string;
};

type SourceHighlightsProps = {
  highlights: Highlights;
};

const SOURCE_STYLES: Record<
  string,
  {
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >;
    color: string;
    border: string;
    bg: string;
  }
> = {
  Reddit: {
    icon: MessageCircle,
    color: 'text-orange-400',
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/10',
  },
  RSS: {
    icon: Rss,
    color: 'text-yellow-400',
    border: 'border-yellow-500/20',
    bg: 'bg-yellow-500/10',
  },
  BBC: {
    icon: Globe,
    color: 'text-rose-500',
    border: 'border-rose-600/20',
    bg: 'bg-rose-500/10',
  },
  'New York Times': {
    icon: Newspaper,
    color: 'text-zinc-100',
    border: 'border-zinc-600/30',
    bg: 'bg-zinc-800/50',
  },
  Default: {
    icon: Radio,
    color: 'text-blue-400',
    border: 'border-blue-500/20',
    bg: 'bg-blue-500/10',
  },
};

export function SourceHighlights({ highlights }: SourceHighlightsProps) {
  const activeHighlights = Object.entries(highlights);

  if (activeHighlights.length === 0) return null;

  return (
    <SectionWrapper
      title="Source Breakdown"
      icon={<Radio className="w-5 h-5 text-indigo-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeHighlights.map(([source, text]) => {
          const style = SOURCE_STYLES[source] || SOURCE_STYLES['Default'];
          const Icon = style.icon;

          return (
            <div
              key={source}
              className={`relative overflow-hidden rounded-xl border p-6 text-left transition-all hover:scale-[1.01] ${style.bg} ${style.border}`}
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full blur-2xl`}
              />

              <div className="flex items-center gap-3 mb-4 relative z-10">
                <div
                  className={`p-2 rounded-lg bg-black/50 border border-white/5 ${style.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h4 className={`text-xl font-bold ${style.color}`}>{source}</h4>
              </div>

              <p className="text-gray-300 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4">
                {text}
              </p>
            </div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}

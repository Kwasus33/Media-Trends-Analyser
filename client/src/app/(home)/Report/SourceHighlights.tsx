'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Rss,
  Globe,
  Newspaper,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Link2,
  type LucideProps,
} from 'lucide-react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import { SectionWrapper } from '@/components/SectionWrapper';

type Highlights = {
  [key: string]: string;
};

type References = {
  [key: string]: string[];
};

type SourceHighlightsProps = {
  highlights: Highlights;
  references: References;
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

export function SourceHighlights({
  highlights,
  references,
}: SourceHighlightsProps) {
  const activeHighlights = Object.entries(highlights);

  if (activeHighlights.length === 0) return null;

  return (
    <SectionWrapper
      title="Source Breakdown"
      icon={<Radio className="w-5 h-5 text-indigo-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {activeHighlights.map(([source, text]) => (
          <SourceCard
            key={source}
            source={source}
            text={text}
            urls={references[source] || []}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

function SourceCard({
  source,
  text,
  urls,
}: {
  source: string;
  text: string;
  urls: string[];
}) {
  const [showLinks, setShowLinks] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const style = SOURCE_STYLES[source] || SOURCE_STYLES['Default'];
  const Icon = style.icon;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowLinks(false);
      }
    }

    if (showLinks) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLinks]);

  return (
    <div
      ref={cardRef}
      className={`relative flex flex-col rounded-xl border transition-all ${style.border}`}
    >
      <div
        className={`absolute inset-0 rounded-xl overflow-hidden ${style.bg} pointer-events-none`}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 p-6 pb-4 grow">
        <div className="flex items-center gap-3 mb-4">
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

      {urls.length > 0 && (
        <div className="relative z-20 border-t border-white/5 bg-black/20 rounded-b-xl">
          <button
            onClick={() => setShowLinks(!showLinks)}
            className={`w-full flex items-center justify-between px-6 py-3 text-xs uppercase tracking-wider font-medium hover:bg-white/5 transition-colors rounded-b-xl ${style.color}`}
          >
            <span className="flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              {urls.length} Reference{urls.length !== 1 ? 's' : ''}
            </span>
            {showLinks ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>

          {showLinks && (
            <div className="absolute top-[calc(100%+8px)] left-0 w-full z-50 bg-zinc-900 border border-gray-800 rounded-xl shadow-2xl p-2 animate-in slide-in-from-top-2 duration-200">
              <div className="max-h-60 overflow-y-auto custom-scrollbar px-2 py-1 space-y-1">
                {urls.map((url, idx) => (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 group p-2 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-white shrink-0" />
                    <span className="text-gray-400 text-xs truncate group-hover:text-white group-hover:underline">
                      {url}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

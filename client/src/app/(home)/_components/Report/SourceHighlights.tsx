'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Link2,
} from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { type Source, SOURCES } from '@/constants/sources';

type Highlights = Record<Source, string>;

type References = Record<Source, string[]>;

type SourceHighlightsProps = {
  highlights: Highlights;
  references: References;
  isExport?: boolean;
};

type SourceCardProps = {
  source: Source;
  text: string;
  urls: string[];
};

export function SourceHighlights({
  highlights,
  references,
  isExport = false,
}: SourceHighlightsProps) {
  const activeHighlights = Object.entries(highlights);

  if (activeHighlights.length === 0) return null;

  return (
    <SectionWrapper
      title="Source Breakdown"
      icon={<Radio className="w-5 h-5 text-indigo-400" />}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeHighlights.map(([source, text]) => (
          <SourceCard
            key={source}
            source={source as Source}
            text={text}
            urls={isExport ? [] : references[source as Source] || []}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}

export function SourceCard({ source, text, urls = [] }: SourceCardProps) {
  const [showLinks, setShowLinks] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const style = SOURCES[source] || SOURCES.default;
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
    <div ref={cardRef} className="relative flex flex-col rounded-xl">
      <div
        className={`absolute inset-0 rounded-xl overflow-hidden ${style.bg} pointer-events-none`}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 p-6 pb-4 grow">
        <div className="flex items-center gap-5 px-2 mb-4">
          {Icon}
          <h4 className={`text-xl font-bold ${style.color}`}>{source}</h4>
        </div>

        <p className="text-gray-300 leading-relaxed text-sm md:text-base border-t border-white/5 pt-4 pb-2">
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

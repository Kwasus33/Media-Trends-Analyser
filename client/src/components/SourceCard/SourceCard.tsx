'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Link2,
  BarChart2,
} from 'lucide-react';
import { type Source, getSourceConfig } from '@/constants/sources';
import { type Category, getCategoryConfig } from '@/constants/categories';
import { TextExpander } from '@/components/TextExpander';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type SourceCardProps = {
  source: Source;
  text: string;
  urls?: string[];
  categoryCounts?: Record<Category, number>;
};

export function SourceCard({
  source,
  text,
  urls = [],
  categoryCounts,
}: SourceCardProps) {
  const [showLinks, setShowLinks] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const isDesktop = useBreakpoint('md');

  const style = getSourceConfig(source);
  const Icon = style.icon;

  const activeCategories = categoryCounts
    ? Object.entries(categoryCounts)
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
    : [];

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
    <div ref={cardRef} className="relative flex flex-col rounded-xl h-full">
      <div
        className={`absolute inset-0 rounded-xl overflow-hidden ${style.bg} border ${style.border} pointer-events-none`}
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-linear-to-br from-white/5 to-transparent rounded-full blur-2xl" />
      </div>

      <div className="relative z-10 px-4 py-6 sm:p-6 grow flex flex-col">
        <div className="flex items-center gap-4 mb-4">
          {Icon}
          <h4 className={`text-xl font-bold ${style.color}`}>{source}</h4>
        </div>

        <TextExpander
          collapsedHeight={isDesktop ? 240 : 180}
          buttonColor={style.color}
          buttonClassName="bg-black/20 backdrop-blur-md hover:bg-black/40 shadow-lg"
          className="grow"
        >
          <p className="text-gray-300 leading-relaxed text-sm md:text-base">
            {text}
          </p>
        </TextExpander>

        {activeCategories.length > 0 && (
          <div className="mt-2 pt-3 border-t border-white/5">
            <div className="flex items-center gap-2 mb-3">
              <BarChart2 className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                Volume by Topic
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeCategories.map(([category, count]) => {
                const catStyle = getCategoryConfig(category);

                return (
                  <div
                    key={category}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}
                  >
                    <span>{category}</span>
                    <span className="font-bold">{count}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
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

'use client';

import { Radio } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { type Source } from '@/constants/sources';
import { SourceCard } from '@/components/SourceCard';
import { SilentSourceList } from '@/components/SilentSourceList';

type Highlights = Record<Source, string>;

type References = Record<Source, string[]>;

type SourceHighlightsProps = {
  highlights: Highlights;
  references: References;
  isExport?: boolean;
};

export function SourceHighlights({
  highlights,
  references,
  isExport = false,
}: SourceHighlightsProps) {
  const allEntries = Object.entries(highlights);

  if (allEntries.length === 0) return null;

  const validHighlights = allEntries.filter(
    ([, text]) => text && text.trim().length > 0
  );

  const emptySources = allEntries
    .filter(([, text]) => !text || text.trim().length === 0)
    .map(([source]) => source as Source);

  if (validHighlights.length === 0 && emptySources.length === 0) return null;

  return (
    <SectionWrapper
      title="Source Breakdown"
      icon={<Radio className="w-5 h-5 text-indigo-400" />}
    >
      <div className="flex flex-col gap-6">
        {validHighlights.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {validHighlights.map(([source, text]) => (
              <SourceCard
                key={source}
                source={source as Source}
                text={text}
                urls={isExport ? [] : references[source as Source] || []}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 italic">
            No sources provided detailed reports on this topic.
          </div>
        )}

        <SilentSourceList
          sources={emptySources}
          label="No coverage found in:"
        />
      </div>
    </SectionWrapper>
  );
}

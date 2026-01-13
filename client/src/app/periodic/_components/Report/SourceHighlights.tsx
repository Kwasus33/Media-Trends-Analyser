'use client';

import { Radio } from 'lucide-react';
import { SectionWrapper } from '@/components/SectionWrapper';
import { type Source } from '@/constants/sources';
import { SourceCard } from '@/components/SourceCard';

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

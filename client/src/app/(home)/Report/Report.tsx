import { Box } from '@/components/Box';
import { Charts } from './Charts';
import data from '@/data/periodic_summary.json';
import { TrendAnalysis } from './TrendAnalysis';
import { KeyInsights } from './KeyInsights';
import { SourceHighlights } from './SourceHighlights';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FileText } from 'lucide-react';
import { EventTimeline } from './EventTimeline';

type ReportProps = {
  startDate: string;
  endDate: string;
  selectedSources: string[];
};

export function Report({ startDate, endDate, selectedSources }: ReportProps) {
  console.log('selectedSources --->', selectedSources);

  return (
    <Box className="flex flex-col gap-12 min-h-[500px] text-center">
      <SectionWrapper
        title="Executive Summary"
        icon={<FileText className="w-5 h-5 text-blue-400" />}
      >
        <p className="text-gray-300 leading-relaxed text-start text-lg">
          {data.main_summary}
        </p>
      </SectionWrapper>

      <TrendAnalysis trends={data.trends} />

      <KeyInsights insights={data.key_insights} />

      <SourceHighlights
        highlights={data.source_highlights}
        references={data.references}
      />

      <EventTimeline timeline={data.event_timeline} />

      <Charts
        startDate={startDate}
        endDate={endDate}
        categoryData={data.category_totals}
        trendData={data.categories_timeline}
      />
    </Box>
  );
}

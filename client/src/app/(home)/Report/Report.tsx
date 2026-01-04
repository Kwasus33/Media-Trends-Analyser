import { Box } from '@/components/Box';
import { Charts } from './Charts';
import { TrendAnalysis } from './TrendAnalysis';
import { KeyInsights } from './KeyInsights';
import { SourceHighlights } from './SourceHighlights';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FileText } from 'lucide-react';
import { EventTimeline } from './EventTimeline';
import type { ReportData } from '@/types/report';

type ReportProps = {
  data: ReportData;
  startDate: string;
  endDate: string;
  isExport?: boolean;
};

export function Report({
  data,
  startDate,
  endDate,
  isExport = false,
}: ReportProps) {
  return (
    <Box
      className={`flex flex-col gap-12 text-center ${isExport ? 'p-8 min-h-0' : 'min-h-125'}`}
    >
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
        isExport={isExport}
      />

      <EventTimeline timeline={data.event_timeline} isExport={isExport} />

      <Charts
        startDate={startDate}
        endDate={endDate}
        categoryData={data.category_totals}
        trendData={data.categories_timeline}
        isExport={isExport}
      />
    </Box>
  );
}

import { Box } from '@/components/Box';
import { Charts } from './Charts';
import { TrendAnalysis } from './TrendAnalysis';
import { KeyInsights } from './KeyInsights';
import { SourceHighlights } from './SourceHighlights';
import { SectionWrapper } from '@/components/SectionWrapper';
import { FileText } from 'lucide-react';
import { EventTimeline } from './EventTimeline';
import { Button } from '@/components/Button';
import { Printer } from 'lucide-react';
import type { ReportData } from '@/types/report';
import { ShareButton } from '@/components/ShareButton';

type ReportProps = {
  data: ReportData;
  startDate: string;
  endDate: string;
  isExport?: boolean;
  onPrint?: () => void;
};

export function Report({
  data,
  startDate,
  endDate,
  isExport = false,
  onPrint,
}: ReportProps) {
  const printStyle = 'print:break-before-page print:mt-6';

  return (
    <Box
      className={`flex flex-col gap-12 text-center ${isExport ? '' : 'min-h-125'}`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-end -mb-4 gap-4">
        <div className="text-left">
          <h2 className="text-3xl font-bold text-white">Trend Report</h2>
          <p className="text-gray-400 text-sm mt-1">
            Analysis Period:{' '}
            <span className="text-indigo-400">{startDate}</span> to{' '}
            <span className="text-indigo-400">{endDate}</span>
          </p>
        </div>

        {!isExport && onPrint && (
          <div className="flex gap-3">
            <ShareButton />
            <Button onClick={onPrint} className="flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Export PDF
            </Button>
          </div>
        )}
      </div>

      <KeyInsights insights={data.key_insights} />

      <div className={printStyle}>
        <TrendAnalysis trends={data.trends} />
      </div>

      <div className={printStyle}>
        <SourceHighlights
          highlights={data.source_highlights}
          references={data.references}
          isExport={isExport}
        />
      </div>

      <div className={printStyle}>
        <EventTimeline timeline={data.event_timeline} isExport={isExport} />
      </div>

      <div className={printStyle}>
        <Charts
          startDate={startDate}
          endDate={endDate}
          categoryData={data.category_totals}
          trendData={data.categories_timeline}
          isExport={isExport}
        />
      </div>

      <SectionWrapper
        title="Executive Summary"
        icon={<FileText className="w-5 h-5 text-blue-400" />}
      >
        <p className="text-gray-300 leading-relaxed text-start text-lg">
          {data.main_summary}
        </p>
      </SectionWrapper>
    </Box>
  );
}

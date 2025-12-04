import { Box } from '@/components/Box';
import { Charts } from './Charts';
import data from '@/data/periodic_summary.json';
import { TrendAnalysis } from './TrendAnalysis';
import { KeyInsights } from './KeyInsights';

type ReportProps = {
  startDate: string;
  endDate: string;
  selectedSources: string[];
};

export function Report({ startDate, endDate, selectedSources }: ReportProps) {
  console.log('selectedSources --->', selectedSources);

  return (
    <Box className="flex flex-col gap-12 min-h-[500px] text-center">
      <div>
        <h2 className="text-3xl font-bold text-white mb-4">Report</h2>
        <p className="text-gray-400">{data.main_summary}</p>
      </div>

      <Charts
        startDate={startDate}
        endDate={endDate}
        categoryData={data.category_totals}
        trendData={data.categories_timeline}
      />

      <TrendAnalysis trends={data.trends} />

      <KeyInsights insights={data.key_insights} />
    </Box>
  );
}

import { Box } from '@/components/Box';
import { CategoryPieChart } from '@/components/PieChart/CategoryPieChart';
import { CategoryTrendChart } from '@/components/BarChart/CategoryTrendChart';

type CategoryData = {
  name: string;
  value: number;
};

type TrendDataPoint = {
  date: string;
  [key: string]: string | number;
};

type AnalyticsTabProps = {
  startDate: string;
  endDate: string;
  selectedSources: string[];
  categoryData: CategoryData[];
  trendData: TrendDataPoint[];
};

export function AnalyticsTab({
  startDate,
  endDate,
  selectedSources,
  categoryData,
  trendData,
}: AnalyticsTabProps) {
  const sourcesText =
    selectedSources.length > 0
      ? selectedSources.join(', ')
      : 'No data sources selected.';

  const categoryNames = categoryData.map((c) => c.name);

  return (
    <Box className="min-h-[500px] text-center flex flex-col">
      <h2 className="text-3xl font-bold text-white mb-4">Trend Analytics</h2>
      <p className="text-gray-400 mb-2">
        Analytics for period: {startDate || '...'} - {endDate || '...'}
      </p>
      <p className="text-gray-400 mb-6">
        Selected data sources: {sourcesText}.
      </p>

      <CategoryPieChart data={categoryData} />

      <CategoryTrendChart data={trendData} categories={categoryNames} />
    </Box>
  );
}

'use client';

import { Box } from '@/components/Box';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

type CategoryData = {
  name: string;
  value: number;
};

type AnalyticsTabProps = {
  startDate: string;
  endDate: string;
  selectedSources: string[];
  categoryData: CategoryData[];
};

const COLORS = ['#0000FF', '#008000', '#FFA500', '#FF0000', '#800080'];

export function AnalyticsTab({
  startDate,
  endDate,
  selectedSources,
  categoryData,
}: AnalyticsTabProps) {
  const sourcesText =
    selectedSources.length > 0
      ? selectedSources.join(', ')
      : 'No data sources selected.';

  return (
    <Box className="min-h-[500px] text-center flex flex-col">
      <h2 className="text-3xl font-bold text-white mb-4">Trend Analytics</h2>
      <p className="text-gray-400 mb-2">
        Analytics for period: {startDate || '...'} - {endDate || '...'}
      </p>
      <p className="text-gray-400 mb-6">
        Selected data sources: {sourcesText}.
      </p>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={150}
              fill="#CCCCCC"
              dataKey="value"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Box>
  );
}

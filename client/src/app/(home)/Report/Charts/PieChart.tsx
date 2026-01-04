'use client';

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

import { CHART_COLORS } from '@/constants/chartColors';

type CategoryData = {
  name: string;
  value: unknown;
};

type CategoryPieChartProps = {
  data: CategoryData[];
  isExport?: boolean;
};

export function CategoryPieChart({
  data,
  isExport = false,
}: CategoryPieChartProps) {
  const renderChart = () => (
    <PieChart
      width={isExport ? 500 : undefined}
      height={isExport ? 300 : undefined}
    >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={isExport ? 50 : 60}
        outerRadius={isExport ? 80 : 100}
        paddingAngle={4}
        dataKey="value"
        stroke="none"
        isAnimationActive={!isExport}
      >
        {data.map((entry, index) => (
          <Cell
            key={`cell-${index}`}
            fill={CHART_COLORS[index % CHART_COLORS.length]}
          />
        ))}
      </Pie>

      <Tooltip
        contentStyle={{
          backgroundColor: '#09090b',
          border: '1px solid #27272a',
          borderRadius: '8px',
        }}
        itemStyle={{ color: '#e4e4e7' }}
      />

      <Legend verticalAlign="bottom" height={36} iconType="circle" />
    </PieChart>
  );

  if (isExport) {
    return (
      <div className="w-full flex justify-center items-center">
        {renderChart()}
      </div>
    );
  }

  return (
    <div className="w-full h-75 md:h-100">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

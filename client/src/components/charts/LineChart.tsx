'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { CHART_COLORS } from '@/constants/chartColors';
import { CATEGORIES, type Category } from '@/constants/categories';

type TrendDataPoint = {
  date: string;
  [key: string]: string | number;
};

type CategoryTrendChartProps = {
  data: TrendDataPoint[];
  categories: string[];
  isExport?: boolean;
};

export function CategoryTrendChart({
  data,
  categories,
  isExport = false,
}: CategoryTrendChartProps) {
  const renderChart = () => (
    <LineChart
      data={data}
      width={isExport ? 700 : undefined}
      height={isExport ? 300 : undefined}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />

      <XAxis
        dataKey="date"
        stroke="#9ca3af"
        tick={{ fill: '#9ca3af', fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        dy={10}
      />
      <YAxis
        stroke="#9ca3af"
        tick={{ fill: '#9ca3af', fontSize: 12 }}
        tickLine={false}
        axisLine={false}
        dx={-10}
      />
      <Tooltip
        formatter={(
          value: number | string | Array<number | string> | undefined
        ) => {
          if (typeof value === 'number') {
            return `${value}%`;
          }
          if (Array.isArray(value)) {
            return value.join(', ');
          }
          return value;
        }}
        contentStyle={{
          backgroundColor: '#09090b',
          border: '1px solid #27272a',
          borderRadius: '8px',
          padding: '8px 12px',
        }}
        itemStyle={{ color: '#e4e4e7', fontSize: '13px' }}
        labelStyle={{
          color: '#a1a1aa',
          fontSize: '12px',
          marginBottom: '4px',
        }}
        cursor={{ stroke: '#52525b', strokeWidth: 1 }}
      />
      <Legend wrapperStyle={{ paddingTop: '20px' }} />
      {categories.map((category, index) => {
        const color =
          CATEGORIES[category as Category]?.color ||
          CHART_COLORS[index % CHART_COLORS.length];

        return (
          <Line
            key={category}
            dataKey={category}
            stroke={color}
            strokeWidth={2}
            dot={{
              r: 4,
              strokeWidth: 0,
              fill: color,
            }}
            activeDot={{ r: 6 }}
            isAnimationActive={!isExport}
          />
        );
      })}
    </LineChart>
  );

  if (isExport) {
    return (
      <div className="w-full flex justify-center items-center">
        {renderChart()}
      </div>
    );
  }

  return (
    <div className="w-full h-100">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

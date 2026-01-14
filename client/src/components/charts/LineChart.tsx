'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
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
  const getColor = (category: string, index: number) =>
    CATEGORIES[category as Category]?.color ||
    CHART_COLORS[index % CHART_COLORS.length];

  const renderChart = () => (
    <LineChart
      data={data}
      width={isExport ? 700 : undefined}
      height={isExport ? 300 : undefined}
      margin={{
        top: 20,
        right: isExport ? 70 : 10,
        left: isExport ? 40 : -20,
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

      {categories.map((category, index) => (
        <Line
          key={category}
          dataKey={category}
          stroke={getColor(category, index)}
          strokeWidth={2}
          dot={{
            r: 4,
            strokeWidth: 0,
            fill: getColor(category, index),
          }}
          activeDot={{ r: 6 }}
          isAnimationActive={!isExport}
        />
      ))}
    </LineChart>
  );

  const legend = (categories: string[]) =>
    categories.map((category, index) => (
      <div key={category} className="flex items-center gap-2">
        <span
          className="w-5 h-2 rounded-full"
          style={{ backgroundColor: getColor(category, index) }}
        />
        <span
          className="text-md text-gray-300 whitespace-nowrap"
          style={{ color: getColor(category, index) }}
        >
          {category}
        </span>
      </div>
    ));

  if (isExport) {
    return (
      <div className="w-full flex flex-col items-center">
        {renderChart()}
        <div className="flex flex-wrap justify-center gap-4 mt-4">
          {legend(categories)}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <div className="w-full overflow-x-auto pb-2">
        <div className="min-w-150 h-75">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 px-4">
        {legend(categories)}
      </div>
    </div>
  );
}

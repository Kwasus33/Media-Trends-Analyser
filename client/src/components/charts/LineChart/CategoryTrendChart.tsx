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

const COLORS = ['#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6'];

type TrendDataPoint = {
  date: string;
  [key: string]: string | number;
};

type CategoryTrendChartProps = {
  data: TrendDataPoint[];
  categories: string[];
};

export function CategoryTrendChart({
  data,
  categories,
}: CategoryTrendChartProps) {
  return (
    <div className="w-full h-[400px] mt-8">
      {' '}
      <ResponsiveContainer width="100%" height="100%">
        {' '}
        <LineChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="date" stroke="#FFFFFF" />
          <YAxis stroke="#FFFFFF" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#00000',
              border: 'none',
              padding: '4px',
            }}
            itemStyle={{ color: '#FFFFFF' }}
            labelStyle={{ color: '#FFFFFF' }}
          />
          <Legend />{' '}
          {categories.map((category, index) => (
            <Line
              key={category}
              dataKey={category}
              stroke={COLORS[index % COLORS.length]}
            />
          ))}{' '}
        </LineChart>{' '}
      </ResponsiveContainer>{' '}
    </div>
  );
}

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
import { CATEGORIES, type Category } from '@/constants/categories';

type CategoryData = {
  name: string;
  value: unknown;
};

type CategoryPieChartProps = {
  data: CategoryData[];
  isExport?: boolean;
  innerRadius?: number;
  outerRadius?: number;
  legendPosition?: 'bottom' | 'right';
};

export function CategoryPieChart({
  data,
  isExport = false,
  innerRadius,
  outerRadius,
  legendPosition = 'bottom',
}: CategoryPieChartProps) {
  const finalInner = innerRadius ?? (isExport ? 50 : 60);
  const finalOuter = outerRadius ?? (isExport ? 80 : 100);

  const isRightLegend = legendPosition === 'right';
  const legendProps = isRightLegend
    ? {
        layout: 'vertical' as const,
        align: 'right' as const,
        verticalAlign: 'middle' as const,
      }
    : {
        layout: 'horizontal' as const,
        align: 'center' as const,
        verticalAlign: 'bottom' as const,
      };

  const marginZero = { top: 0, left: 0, bottom: 0, right: 0 };

  const renderChart = () => (
    <PieChart
      width={isExport ? 500 : undefined}
      height={isExport ? 300 : undefined}
      margin={isRightLegend ? { ...marginZero, right: 20 } : marginZero}
    >
      <Pie
        data={data}
        cx={isRightLegend ? '40%' : '50%'}
        cy="50%"
        innerRadius={finalInner}
        outerRadius={finalOuter}
        paddingAngle={4}
        dataKey="value"
        stroke="none"
        isAnimationActive={!isExport}
      >
        {data.map((entry, index) => {
          const color =
            CATEGORIES[entry.name as Category]?.color ||
            CHART_COLORS[index % CHART_COLORS.length];

          return <Cell key={`cell-${index}`} fill={color} />;
        })}
      </Pie>

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
        }}
        itemStyle={{ color: '#e4e4e7' }}
      />

      <Legend
        {...legendProps}
        height={isRightLegend ? undefined : 36}
        iconType="circle"
        wrapperStyle={
          isRightLegend ? { paddingLeft: '20px' } : { paddingTop: '10px' }
        }
      />
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
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

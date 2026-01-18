'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  const getColor = (name: string, index: number) => {
    return (
      CATEGORIES[name as Category]?.color ||
      CHART_COLORS[index % CHART_COLORS.length]
    );
  };

  const renderChart = () => (
    <PieChart
      width={isExport ? 500 : undefined}
      height={isExport ? 300 : undefined}
      margin={{ top: 0, left: 0, bottom: 0, right: 0 }}
    >
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        innerRadius={finalInner}
        outerRadius={finalOuter}
        paddingAngle={4}
        dataKey="value"
        stroke="none"
        isAnimationActive={!isExport}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={getColor(entry.name, index)} />
        ))}
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
    </PieChart>
  );

  return (
    <div
      className={`w-full h-full flex ${isRightLegend ? 'flex-row items-center' : 'flex-col'}`}
    >
      <div
        className={`
          relative mx-auto
          ${isExport ? 'h-75 w-75' : 'h-62'}
          ${isRightLegend ? 'flex-1 min-w-50' : 'w-full'}
        `}
      >
        {isExport ? (
          <div className="w-full h-full flex justify-center items-center">
            {renderChart()}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        )}
      </div>

      <div
        className={`
        flex flex-wrap gap-x-4 gap-y-2 text-md
        ${
          isRightLegend
            ? 'flex-col items-start justify-center ml-4 min-w-30'
            : 'justify-center mt-4 px-4'
        }
      `}
      >
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <span
              className="w-4 h-4 rounded-full shrink-0"
              style={{ backgroundColor: getColor(entry.name, index) }}
            />
            <span
              className="whitespace-nowrap"
              style={{ color: getColor(entry.name, index) }}
            >
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

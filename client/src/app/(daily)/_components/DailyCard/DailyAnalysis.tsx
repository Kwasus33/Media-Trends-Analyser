'use client';

import { BarChart3, Info } from 'lucide-react';
import { CategoryPieChart } from '@/components/charts/PieChart';
import { getCategoryConfig } from '@/constants/categories';
import type { TopCategory } from '@/types/dailyReport';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type DailyAnalysisProps = {
  topCategories: TopCategory[];
  pieData: { name: string; value: number }[];
};

export function DailyAnalysis({ topCategories, pieData }: DailyAnalysisProps) {
  const isDesktop = useBreakpoint('sm');

  if (topCategories.length === 0) return null;

  const primary = topCategories[0];
  const secondary = topCategories[1];

  return (
    <div className="grid grid-cols-1 min-[900px]:grid-cols-2 gap-2 items-center border-t border-white/5 bg-black/20 p-4 md:p-8">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-medium">
            Quantitative Analysis
          </h4>
        </div>

        <h3 className="text-xl font-bold text-white">
          {primary.category} leads the narrative.
        </h3>

        <p className="text-gray-400 text-sm leading-relaxed">
          The data highlights a strong focus on{' '}
          <span className={getCategoryConfig(primary.category).text}>
            {primary.category}
          </span>
          , which accounted for{' '}
          <span className="text-indigo-400 font-bold">{primary.percent}%</span>{' '}
          of the total volume.
          {secondary && (
            <>
              {' '}
              This was followed by{' '}
              <span className={getCategoryConfig(secondary.category).text}>
                {secondary.category}
              </span>{' '}
              at {secondary.percent}%.
            </>
          )}
        </p>

        <div className="flex items-center gap-2 p-3 bg-indigo-500/5 border border-indigo-500/10 rounded-lg">
          <Info className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs text-indigo-300">
            Percentages represent the average share of voice across all
            monitored sources.
          </span>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-sm h-full">
          <CategoryPieChart
            data={pieData}
            isExport={false}
            innerRadius={40}
            outerRadius={65}
            legendPosition={isDesktop ? 'right' : 'bottom'}
          />
        </div>
      </div>
    </div>
  );
}

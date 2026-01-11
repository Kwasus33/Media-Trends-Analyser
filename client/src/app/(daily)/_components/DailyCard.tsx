'use client';

import { useState, useMemo } from 'react';
import type { Category } from '@/constants/categories';
import type { DailyReport } from '@/types/dailyReport';

import { DailyHeader } from './DailyHeader';
import { DailyFilters, DailySourceGrid } from './DailySummaries';
import { DailyAnalysis } from './DailyAnalysis';

type DailyCardProps = {
  data: DailyReport;
};

export function DailyCard({ data }: DailyCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<Category>('Politics');

  const { topCategories, pieData } = useMemo(() => {
    const totals: Record<string, number> = {};

    Object.values(data.categories).forEach((sourceCats) => {
      Object.entries(sourceCats).forEach(([category, count]) => {
        totals[category] = (totals[category] || 0) + count;
      });
    });

    const total = Object.values(totals).reduce((a, b) => a + b, 0);

    const sorted = Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category,
        count,
        percent: total > 0 ? Math.round((count / total) * 100) : 0,
      }));

    const pieData = sorted.map((item) => ({
      name: item.category,
      value: item.percent,
    }));

    return { topCategories: sorted, pieData };
  }, [data]);

  const availableCategories = useMemo(() => {
    const categories = new Set<Category>();

    Object.values(data.summaries).forEach((sourceData) => {
      Object.keys(sourceData).forEach((category) => {
        const typedCategory = category as Category;
        categories.add(typedCategory);
      });
    });

    return Array.from(categories).sort();
  }, [data]);

  const currentCategory = availableCategories.includes(activeCategory)
    ? activeCategory
    : availableCategories[0];

  return (
    <div className="bg-white/4 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20">
      <DailyHeader
        date={data.date}
        topCategories={topCategories}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <div className="border-t border-white/5 bg-black/20">
          <DailyFilters
            availableCategories={availableCategories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
          />

          <DailySourceGrid data={data} currentCategory={currentCategory} />

          <DailyAnalysis topCategories={topCategories} pieData={pieData} />
        </div>
      )}
    </div>
  );
}

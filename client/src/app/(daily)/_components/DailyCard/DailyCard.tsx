'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import type { Category } from '@/constants/categories';
import type { DailyReport } from '@/types/dailyReport';

import { DailyButton } from './DailyButton';
import { DailyFilters, DailySourceGrid } from './DailySummaries';
import { DailyAnalysis } from './DailyAnalysis';

type DailyCardProps = {
  data: DailyReport;
  isOpenByDefault?: boolean;
};

export function DailyCard({ data, isOpenByDefault = false }: DailyCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [activeCategory, setActiveCategory] = useState<Category>('Politics');

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (isOpen && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [isOpen]);

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
      Object.keys(sourceData).forEach((category) =>
        categories.add(category as Category)
      );
    });

    return Array.from(categories).sort();
  }, [data]);

  const currentCategory = availableCategories.includes(activeCategory)
    ? activeCategory
    : availableCategories[0];

  return (
    <div
      ref={cardRef}
      className="bg-white/4 border border-white/10 rounded-xl overflow-hidden transition-all duration-300 hover:border-white/20"
    >
      <DailyButton
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

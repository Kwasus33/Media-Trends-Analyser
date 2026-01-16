'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { FileQuestion } from 'lucide-react';
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

  const [isOpen, setIsOpen] = useState(isOpenByDefault);
  const [activeCategory, setActiveCategory] = useState<Category>('Politics');

  const prevIsOpen = useRef(isOpen);

  useEffect(() => {
    if (!prevIsOpen.current && isOpen && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    prevIsOpen.current = isOpen;
  }, [isOpen]);

  const { topCategories, pieData } = useMemo(() => {
    if (!data.has_data || !data.categories) {
      return { topCategories: [], pieData: [] };
    }

    const totals: Record<string, number> = {};

    Object.values(data.categories).forEach((sourceCats) => {
      Object.entries(sourceCats).forEach(([category, count]) => {
        totals[category] = (totals[category] || 0) + count;
      });
    });

    const total = Object.values(totals).reduce((a, b) => a + b, 0);

    const sorted = Object.entries(totals)
      .filter(([, count]) => count !== 0)
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
    if (!data.has_data || !data.summaries) return [];

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
      className={`
        border rounded-xl overflow-hidden transition-all duration-300
        ${
          data.has_data
            ? 'bg-white/4 border-white/10 hover:border-white/20'
            : 'bg-white/2 border-white/5'
        }
      `}
    >
      <DailyButton
        date={data.date}
        topCategories={topCategories}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        hasData={data.has_data}
      />

      {isOpen && (
        <div className="border-t border-white/5 bg-black/20">
          {data.has_data ? (
            <>
              <DailyFilters
                availableCategories={availableCategories}
                activeCategory={activeCategory}
                onSelect={setActiveCategory}
              />
              <DailySourceGrid data={data} currentCategory={currentCategory} />
              <DailyAnalysis topCategories={topCategories} pieData={pieData} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/5">
                <FileQuestion className="w-8 h-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-1">
                No Data Available
              </h3>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed">
                We couldn&apos;t retrieve any news sources or summaries for this
                date.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { SourceCard } from '@/components/SourceCard';
import type { Category } from '@/constants/categories';
import type { Source } from '@/constants/sources';
import type { DailyReport } from '@/types/dailyReport';

type DailyFiltersProps = {
  availableCategories: Category[];
  activeCategory: Category;
  onSelect: (category: Category) => void;
};

export function DailyFilters({
  availableCategories,
  activeCategory,
  onSelect,
}: DailyFiltersProps) {
  return (
    <div className="p-6 border-b border-white/5 flex flex-col gap-6">
      <div className="text-sm text-gray-400 leading-relaxed max-w-3xl">
        <strong className="text-white block mb-1">Select a Category</strong>
        Explore how different sources covered the key topics of the day. Click a
        category below to filter the summaries.
      </div>

      <div className="flex flex-wrap gap-2">
        {availableCategories.map((category) => (
          <button
            key={category}
            onClick={() => onSelect(category)}
            className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all border
                    ${
                      activeCategory === category
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                        : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white hover:border-white/10'
                    }
                  `}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

type DailySourceGridProps = {
  data: DailyReport;
  currentCategory: Category;
};

export function DailySourceGrid({
  data,
  currentCategory,
}: DailySourceGridProps) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(data.summaries).map(([sourceName, categories]) => {
        const summaryText = categories[currentCategory];

        if (!summaryText) return null;

        const typedSource = sourceName as Source;
        const sourceCounts = data.categories[typedSource];

        return (
          <SourceCard
            key={sourceName}
            source={typedSource}
            text={summaryText}
            categoryCounts={sourceCounts}
          />
        );
      })}
    </div>
  );
}

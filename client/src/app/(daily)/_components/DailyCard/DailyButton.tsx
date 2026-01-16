'use client';

import { ChevronDown, Calendar } from 'lucide-react';
import { getCategoryConfig } from '@/constants/categories';
import type { TopCategory } from '@/types/dailyReport';

type DailyButtonProps = {
  date: string;
  topCategories: TopCategory[];
  isOpen: boolean;
  onToggle: () => void;
  hasData?: boolean;
};

export function DailyButton({
  date,
  topCategories,
  isOpen,
  onToggle,
  hasData = true,
}: DailyButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-full flex flex-col md:flex-row md:items-center justify-between p-3 sm:p-6 transition-colors text-left gap-4
        ${hasData ? 'hover:bg-white/4' : 'opacity-70 hover:opacity-100'}
      `}
    >
      <div className="flex items-center gap-4 shrink-0">
        <div
          className={`
            p-2.5 rounded-lg shrink-0
            ${hasData ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}
          `}
        >
          <Calendar className="w-6 h-6" />
        </div>

        <h3
          className={`text-xl font-bold tracking-tight ${hasData ? 'text-white' : 'text-gray-400'}`}
        >
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
        </h3>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        {hasData ? (
          <div className="flex flex-wrap gap-2 items-center">
            {topCategories.slice(0, 3).map((item) => {
              const style = getCategoryConfig(item.category);
              return (
                <div
                  key={item.category}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}
                >
                  <span>{item.category}</span>
                  <span className="opacity-70">| {item.percent}%</span>
                </div>
              );
            })}
            {topCategories.length > 3 && (
              <span className="text-xs text-gray-500 font-medium px-1">
                +{topCategories.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm font-medium text-gray-500 italic px-2">
            No data available
          </span>
        )}

        <div
          className={`hidden md:block p-2 rounded-full bg-white/5 transition-transform duration-300 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </button>
  );
}

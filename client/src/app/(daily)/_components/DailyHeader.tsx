'use client';

import { ChevronDown, Calendar } from 'lucide-react';
import { getCategoryConfig } from '@/constants/categories';
import type { TopCategory } from '@/types/dailyReport';

type DailyHeaderProps = {
  date: string;
  topCategories: TopCategory[];
  isOpen: boolean;
  onToggle: () => void;
};

export function DailyHeader({
  date,
  topCategories,
  isOpen,
  onToggle,
}: DailyHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-6 hover:bg-white/4 transition-colors text-left gap-4"
    >
      <div className="flex items-center gap-4 shrink-0">
        <div className="bg-indigo-500/20 p-2.5 rounded-lg text-indigo-400 shrink-0">
          <Calendar className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">
          {new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            weekday: 'short',
          })}
        </h3>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
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

        <div
          className={`hidden md:block p-2 rounded-full bg-white/5 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </button>
  );
}

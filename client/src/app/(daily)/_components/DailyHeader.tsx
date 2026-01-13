import { Sparkles, CalendarRange } from 'lucide-react';
import { useMemo } from 'react';

type DailyHeaderProps = {
  dateRange?: {
    start: Date;
    end: Date;
  };
};

export function DailyHeader({ dateRange }: DailyHeaderProps) {
  const getShortDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const periodLabel = useMemo(() => {
    if (!dateRange) {
      return 'Trend Analysis';
    }

    const periodLength =
      dateRange.end.getDate() - dateRange.start.getDate() + 1;

    return `${periodLength}-Day Trend Analysis`;
  }, [dateRange]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-white leading-tight">
            {periodLabel}
          </h2>

          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
            Daily Breakdown
          </p>
        </div>
      </div>

      {dateRange && (
        <div className="flex items-center gap-3 px-4 py-3 bg-white/4 border border-white/10 rounded-xl">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <CalendarRange className="w-5 h-5" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Analysis Period
            </span>

            <span className="text-sm font-semibold text-white">
              {getShortDate(dateRange.end)} - {getShortDate(dateRange.start)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

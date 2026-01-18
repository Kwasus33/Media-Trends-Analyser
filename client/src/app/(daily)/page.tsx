import { Inbox } from 'lucide-react';
import { Box } from '@/components/Box';
import { fetchDailyReports } from './api';
import { DailyHeader } from './_components/DailyHeader';
import { DailyCard } from './_components/DailyCard';

export default async function DailySummaryPage() {
  const dailyReports = await fetchDailyReports();

  if (!dailyReports) return null;

  const hasReports = dailyReports.length > 0;

  const dateRange = hasReports
    ? {
        start: new Date(dailyReports[dailyReports.length - 1].date),
        end: new Date(dailyReports[0].date),
      }
    : undefined;

  return (
    <Box>
      <DailyHeader dateRange={dateRange} />

      {hasReports ? (
        <div className="flex flex-col gap-4">
          {dailyReports.map((dayData, index) => (
            <DailyCard
              key={dayData.date}
              data={dayData}
              isOpenByDefault={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in duration-500">
          <div className="p-4 bg-white/5 rounded-full mb-4 border border-white/10">
            <Inbox className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            No Daily Reports Found
          </h3>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            There are no summaries available for the latest period. Please check
            back later.
          </p>
        </div>
      )}
    </Box>
  );
}

import { Box } from '@/components/Box';
import { fetchDailyReports } from './api';
import { DailyHeader } from './_components/DailyHeader';
import { DailyCard } from './_components/DailyCard';

export default async function DailySummaryPage() {
  const dailyReports = await fetchDailyReports();

  if (!dailyReports) return null;

  const dateRange =
    dailyReports.length > 0
      ? {
          start: new Date(dailyReports[dailyReports.length - 1].date),
          end: new Date(dailyReports[0].date),
        }
      : undefined;

  return (
    <Box>
      <DailyHeader dateRange={dateRange} />

      <div className="flex flex-col gap-4">
        {dailyReports.map((dayData, index) => (
          <DailyCard
            key={dayData.date}
            data={dayData}
            isOpenByDefault={index === 0}
          />
        ))}
      </div>
    </Box>
  );
}

import { Box } from '@/components/Box';
import { DailyList } from './_components/DailyList';
import { fetchDailyReports } from './api';
import { DailyHeader } from './_components/DailyHeader';

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

      <DailyList data={dailyReports} />
    </Box>
  );
}

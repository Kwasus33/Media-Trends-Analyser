import { getISODate } from '@/utils/dateUtils';
import mockData from '@/data/daily.json';
import type { DailyReport } from '@/types/dailyReport';

type DailyFilters = {
  from?: string;
  to?: string;
};

const toDate = new Date();

const fromDate = new Date();
fromDate.setDate(fromDate.getDate() - 7);

const defaultFilters = {
  from: getISODate(fromDate),
  to: getISODate(toDate),
};

export async function fetchDailyReports(
  filters: DailyFilters = defaultFilters
) {
  // Delete in the future
  if (!filters) return;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TODO - API Fetch

  mockData.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return mockData as DailyReport[];
}

import mockData from '@/data/periodic_summary.json';
import type { PeriodicReport } from '@/types/periodicReport';

type PeriodicFilters = {
  source?: string | string[];
  category?: string | string[];
  from?: string;
  to?: string;
};

export async function fetchPeriodicReport(filters: PeriodicFilters) {
  if (!filters) return;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TODO - API Fetch

  return mockData as PeriodicReport;
}

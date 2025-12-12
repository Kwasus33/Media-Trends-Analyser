import mockData from '@/data/periodic_summary.json';
import type { ReportData } from '@/types/report';

type ReportFilters = {
  source?: string | string[];
  category?: string | string[];
  from?: string;
  to?: string;
};

export async function fetchReportData(filters: ReportFilters) {
  if (!filters) return;

  await new Promise((resolve) => setTimeout(resolve, 2000));

  // TODO - API Fetch

  return mockData as ReportData;
}

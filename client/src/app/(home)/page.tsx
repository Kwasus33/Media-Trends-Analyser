import { ClientWrapper } from './ClientWrapper';
import { fetchReportData } from './api';

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const paramsKey = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  const hasFilters = Object.keys(params).length > 0;
  const reportData = hasFilters ? await fetchReportData(params) : null;

  const startDate = typeof params.from === 'string' ? params.from : '';
  const endDate = typeof params.to === 'string' ? params.to : '';

  return (
    <ClientWrapper
      reportData={reportData ?? null}
      startDate={startDate}
      endDate={endDate}
      searchParamsKey={paramsKey}
    />
  );
}

import { ControlPanel } from './ControlPanel';
import { Report } from './Report';
import { fetchReportData } from './api';
import { HeaderLogo } from '@/components/HeaderLogo';

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

  return (
    <main className="w-full p-8">
      <HeaderLogo />

      <ControlPanel key={paramsKey}>
        {reportData && (
          <Report
            data={reportData}
            startDate={typeof params.from === 'string' ? params.from : ''}
            endDate={typeof params.to === 'string' ? params.to : ''}
          />
        )}
      </ControlPanel>
    </main>
  );
}

import { ControlPanel } from './ControlPanel';
import { Report } from './Report';
import { fetchReportData } from './api';

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const hasFilters = Object.keys(params).length > 0;
  const reportData = hasFilters ? await fetchReportData(params) : null;

  return (
    <main className="w-full p-8">
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
            Media Trends
          </span>{' '}
          <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Analyser
          </span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          AI-powered insights across global news sources and social platforms.
        </p>
      </header>

      <ControlPanel>
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

'use client';

type AnalyticsTabProps = {
  startDate: string;
  endDate: string;
  selectedSources: string[];
};

export default function AnalyticsTab({
  startDate,
  endDate,
  selectedSources,
}: AnalyticsTabProps) {
  const sourcesText =
    selectedSources.length > 0
      ? selectedSources.join(', ')
      : 'No data sources selected.';

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[500px] text-center mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold text-white mb-4">Trend Analytics</h2>
      <p className="text-gray-400 mb-2">
        Analytics for period: {startDate || '...'} - {endDate || '...'}
      </p>
      <p className="text-gray-400 mb-6">
        Selected data sources: {sourcesText}.
      </p>
      <div className="text-gray-500 italic">Analytics</div>
    </div>
  );
}

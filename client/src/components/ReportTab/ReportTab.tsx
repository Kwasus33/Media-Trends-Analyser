'use client';

type ReportTabProps = {
  reportSummary: string;
};

export function ReportTab({ reportSummary }: ReportTabProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[500px] text-center mx-auto max-w-7xl">
      <h2 className="text-3xl font-bold text-white mb-4">Report</h2>
      <p className="text-gray-400">{reportSummary}</p>
    </div>
  );
}

'use client';

import { Box } from '@/components/Box';

type ReportTabProps = {
  reportSummary: string;
};

export function ReportTab({ reportSummary }: ReportTabProps) {
  return (
    <Box className="min-h-[500px] text-center">
      <h2 className="text-3xl font-bold text-white mb-4">Report</h2>
      <p className="text-gray-400">{reportSummary}</p>
    </Box>
  );
}

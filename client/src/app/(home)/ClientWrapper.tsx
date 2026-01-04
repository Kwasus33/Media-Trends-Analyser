'use client';

import type { ReportData } from '@/types/report';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ControlPanel } from './ControlPanel';
import { Button } from '@/components/Button';
import { Printer } from 'lucide-react';
import { Report } from './Report';

type ClientWrapperProps = {
  reportData: ReportData | null;
  startDate: string;
  endDate: string;
  searchParamsKey: string;
};

export function ClientWrapper({
  reportData,
  startDate,
  endDate,
  searchParamsKey,
}: ClientWrapperProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Trend-Report-${startDate}-${endDate}`,
  });

  return (
    <ControlPanel key={searchParamsKey}>
      {reportData && (
        <>
          <div className="flex justify-end mb-6">
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              <Printer className="w-4 h-4" />
              Export PDF
            </Button>
          </div>

          <Report
            data={reportData}
            startDate={startDate}
            endDate={endDate}
            isExport={false}
          />

          <div className="hidden">
            <div
              ref={printRef}
              className="bg-[#030712] text-white p-8 print:block"
            >
              <div className="mb-8 border-b border-gray-800 pb-6">
                <h1 className="text-3xl font-bold mb-2">
                  Trend Analysis Report
                </h1>
                <p className="text-gray-400">
                  Period: {startDate} to {endDate}
                </p>
              </div>
              <Report
                data={reportData}
                startDate={startDate}
                endDate={endDate}
                isExport={true}
              />
            </div>
          </div>
        </>
      )}
    </ControlPanel>
  );
}

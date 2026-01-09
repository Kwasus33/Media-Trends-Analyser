'use client';

import type { ReportData } from '@/types/report';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { ControlPanel } from './_components/ControlPanel';
import { Report } from './_components/Report';

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
          <Report
            data={reportData}
            startDate={startDate}
            endDate={endDate}
            isExport={false}
            onPrint={handlePrint}
          />

          <div className="hidden">
            <div
              ref={printRef}
              className="bg-[#030712] text-white p-8 print:block print:w-full"
              style={{ minHeight: '100vh' }}
            >
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

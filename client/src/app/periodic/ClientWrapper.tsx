'use client';

import { useRef, useState, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { ControlPanel } from './_components/ControlPanel';
import { Report } from './_components/Report';
import { checkTaskStatus } from './api';
import type { PeriodicReport } from '@/types/periodicReport';

type ClientWrapperProps = {
  initialData: PeriodicReport | null;
  taskId: string | null;
  initialError?: string | null;
  startDate: string;
  endDate: string;
  searchParamsKey: string;
};

export function ClientWrapper({
  initialData,
  taskId,
  initialError,
  startDate,
  endDate,
  searchParamsKey,
}: ClientWrapperProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const [data, setData] = useState<PeriodicReport | null>(initialData);
  const [error, setError] = useState<string | null>(initialError || null);

  const [isPolling, setIsPolling] = useState(
    !!taskId && !initialData && !initialError
  );

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Trend-Report-${startDate}-${endDate}`,
  });

  const handleRetry = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (!isPolling || !taskId) return;

    const interval = setInterval(async () => {
      try {
        const statusData = await checkTaskStatus(taskId);

        if (statusData.status === 'completed' && statusData.result) {
          setData(statusData.result);
          setIsPolling(false);
        } else if (statusData.status === 'failed') {
          throw new Error('Periodic Report  generation failed on the backend.');
        }
      } catch (error) {
        console.error('Polling error:', error);
        setError('The report generation failed during processing.');
        setIsPolling(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPolling, taskId]);

  return (
    <ControlPanel key={searchParamsKey} isPolling={isPolling}>
      {isPolling && null}

      {!isPolling && error && (
        <div className="flex flex-col items-center justify-center py-10 px-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="p-4 bg-red-500/10 rounded-full mb-4 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Unable to Generate Report
          </h3>
          <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      )}

      {!isPolling && !error && data && (
        <>
          <Report
            data={data}
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
                data={data}
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

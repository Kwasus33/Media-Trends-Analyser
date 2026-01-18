'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Box } from '@/components/Box';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <Box className="flex flex-col items-center justify-center min-h-100 gap-6 text-center p-8">
      <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-500" />
      </div>

      <div className="space-y-2 max-w-md">
        <h2 className="text-xl font-bold text-white">
          Failed to load daily reports
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          {'We encountered an unexpected error while fetching the latest data.'}
        </p>
      </div>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-medium transition-all active:scale-95"
      >
        <RotateCcw className="w-4 h-4" />
        Try Again
      </button>
    </Box>
  );
}

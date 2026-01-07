'use client';

import {
  useState,
  useTransition,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { SourceSelector } from '@/components/SourceSelector';
import { CategorySelector } from '@/components/CategorySelector';

const MIN_DATA_DATE = '2026-01-01';

const dataSources = [
  'Reddit',
  'BBC',
  'NY Times',
  'Source 1',
  'Source 2',
  'Source 3',
];
const dataCategories = [
  'Technology',
  'Politics',
  'Economy',
  'Sport',
  'Culture',
  'Society',
];

const getToday = () => new Date().toISOString().split('T')[0];

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().split('T')[0];
};

type ControlPanelProps = {
  children: ReactNode;
};

export function ControlPanel({ children }: ControlPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    const fromUrl = searchParams.getAll('source');
    return fromUrl.length > 0 ? fromUrl : dataSources;
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const fromUrl = searchParams.getAll('category');
    return fromUrl.length > 0 ? fromUrl : dataCategories;
  });

  const [startDate, setStartDate] = useState<string>(
    searchParams.get('from') || getYesterday()
  );

  const [endDate, setEndDate] = useState<string>(
    searchParams.get('to') || getToday()
  );

  const todayDate = getToday();

  const isButtonDisabled =
    !startDate ||
    !endDate ||
    !selectedSources.length ||
    !selectedCategories.length ||
    isPending;

  const handleSourceChange = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newStart = event.target.value;

    if (newStart < MIN_DATA_DATE) return;

    setStartDate(newStart);

    if (endDate && newStart > endDate) {
      setEndDate(newStart);
    }
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newEnd = event.target.value;

    if (newEnd < MIN_DATA_DATE) return;

    setEndDate(newEnd);
  };

  const handleGenerateReport = () => {
    const params = new URLSearchParams();

    selectedSources.forEach((s) => params.append('source', s));
    selectedCategories.forEach((c) => params.append('category', c));
    params.set('from', startDate);
    params.set('to', endDate);

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    startTransition(() => {
      if (newQueryString === currentQueryString) {
        router.refresh();
      } else {
        router.push(`/?${newQueryString}`, { scroll: false });
      }
    });
  };

  return (
    <>
      <Box className="flex flex-col gap-5 mb-8 max-w-5xl mx-auto px-6 py-6">
        <div className="flex flex-col gap-3 items-center">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sources
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {dataSources.map((source) => (
              <SourceSelector
                key={source}
                source={source}
                checked={selectedSources.includes(source)}
                onChange={() => handleSourceChange(source)}
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full max-w-2xl mx-auto bg-gray-800/60" />

        <div className="flex flex-col gap-3 items-center">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categories
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {dataCategories.map((category) => (
              <CategorySelector
                key={category}
                category={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full max-w-2xl mx-auto bg-gray-800/60" />

        <div className="flex flex-col md:flex-row items-end md:items-center justify-center gap-6 w-full pt-1">
          <DateInput
            id="startDate"
            label="From date"
            value={startDate}
            min={MIN_DATA_DATE}
            max={todayDate}
            onChange={handleStartDateChange}
          />

          <DateInput
            id="endDate"
            label="To date"
            value={endDate}
            min={startDate || MIN_DATA_DATE}
            max={todayDate}
            onChange={handleEndDateChange}
          />

          <Button
            onClick={handleGenerateReport}
            className="w-full md:w-auto md:min-w-48 h-10 text-base shadow-lg shadow-indigo-500/20"
            disabled={isButtonDisabled}
          >
            {isPending ? 'Processing...' : 'Generate Report'}
          </Button>
        </div>
      </Box>

      {isPending ? (
        <div className="w-full flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-xl font-medium text-white">Analyzing Data...</h3>
          <p className="text-gray-400 text-sm mt-2">
            Aggregating trends from selected sources
          </p>
        </div>
      ) : (
        children
      )}
    </>
  );
}

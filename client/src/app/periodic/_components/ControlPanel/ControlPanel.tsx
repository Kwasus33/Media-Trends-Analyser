'use client';

import {
  useState,
  useTransition,
  type ReactNode,
  type ChangeEvent,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { SourceSelector } from '@/components/SourceSelector';
import { CategorySelector } from '@/components/CategorySelector';
import { type Source, SOURCES } from '@/constants/sources';
import { CATEGORIES } from '@/constants/categories';
import { getISODate } from '@/utils/dateUtils';
import { LoadingState } from '@/components/LoadingState';

const MIN_DATA_DATE = '2026-01-01';

const categoriesList = Object.keys(CATEGORIES)
  .filter((category) => category !== 'default')
  .sort();

const getToday = () => getISODate(new Date());

const getYesterday = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return getISODate(date);
};

type ControlPanelProps = {
  children: ReactNode;
};

export function ControlPanel({ children }: ControlPanelProps) {
  const sourcesNames = Object.keys(SOURCES).filter(
    (source) => source !== 'default'
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [selectedSources, setSelectedSources] = useState<string[]>(() => {
    const fromUrl = searchParams.getAll('source');
    return fromUrl.length > 0 ? fromUrl : sourcesNames;
  });

  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const fromUrl = searchParams.getAll('category');
    return fromUrl.length > 0 ? fromUrl : categoriesList;
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
        router.push(`/periodic?${newQueryString}`, { scroll: false });
      }
    });
  };

  return (
    <>
      <Box className="flex flex-col gap-5 mb-8 max-w-5xl mx-auto p-3 sm:p-6 pb-8">
        <div className="flex flex-col gap-3 items-center">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Sources
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {sourcesNames.map((rawSource) => {
              const source = rawSource as Source;

              return (
                <SourceSelector
                  key={source}
                  source={source}
                  checked={selectedSources.includes(source)}
                  onChange={() => handleSourceChange(source)}
                />
              );
            })}
          </div>
        </div>

        <div className="h-px w-full max-w-3xl mx-auto bg-gray-800/60" />

        <div className="flex flex-col gap-3 items-center">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Categories
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            {categoriesList.map((category) => (
              <CategorySelector
                key={category}
                category={category}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryChange(category)}
              />
            ))}
          </div>
        </div>

        <div className="h-px w-full max-w-3xl mx-auto bg-gray-800/60" />

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full pt-1">
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
            className="w-full md:mt-auto md:w-auto md:min-w-60 h-12 text-lg shadow-lg shadow-indigo-500/20 flex items-center justify-center"
            disabled={isButtonDisabled}
          >
            {isPending ? 'Processing...' : 'Generate Report'}
          </Button>
        </div>
      </Box>

      {isPending ? (
        <LoadingState
          title="Analyzing Data..."
          description="Aggregating trends from selected sources"
        />
      ) : (
        children
      )}
    </>
  );
}

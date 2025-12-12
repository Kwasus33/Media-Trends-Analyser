'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { SourceSelector } from '@/components/SourceSelector';
import { CategorySelector } from '@/components/CategorySelector';

const dataSources = ['Reddit', 'RSS Feeds', 'BBC', 'NY Times'];
const dataCategories = [
  'Technology',
  'Politics',
  'Economy',
  'Sport',
  'Culture',
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

  const todayDate = new Date().toISOString().slice(0, 10);

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
      <Box className="flex flex-col gap-6 mb-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center pt-4 border-t border-gray-800">
          {dataSources.map((source) => (
            <SourceSelector
              key={source}
              source={source}
              checked={selectedSources.includes(source)}
              onChange={() => handleSourceChange(source)}
            />
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
          {dataCategories.map((category) => (
            <CategorySelector
              key={category}
              category={category}
              checked={selectedCategories.includes(category)}
              onChange={() => handleCategoryChange(category)}
            />
          ))}
        </div>

        <div className="justify-center flex flex-col sm:flex-row items-end border-b border-gray-800 pb-6 mx-auto max-w-4xl w-full">
          <DateInput
            id="startData"
            label="From:"
            className="sm:mr-4"
            value={startDate}
            max={endDate || todayDate}
            onChange={(event) => setStartDate(event.target.value)}
          />

          <DateInput
            id="endDate"
            label="To:"
            className="sm:mr-8"
            value={endDate}
            min={startDate}
            max={todayDate}
            onChange={(event) => setEndDate(event.target.value)}
          />

          <Button
            onClick={handleGenerateReport}
            className="w-full sm:w-auto self-end"
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

'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { Report } from './Report';
import { Loader2 } from 'lucide-react';
import { SourceSelector } from '@/components/SourceSelector/SourceSelector';
import { CategorySelector } from '@/components/CategorySelector/CategorySelector';

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

export default function Home() {
  const [selectedSources, setSelectedSources] = useState<string[]>(dataSources);
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(dataCategories);
  const [startDate, setStartDate] = useState<string>(getYesterday());
  const [endDate, setEndDate] = useState<string>(getToday());

  const [loading, setLoading] = useState<boolean>(false);
  const [reportVisible, setReportVisible] = useState<boolean>(false);

  const todayDate = new Date().toISOString().slice(0, 10);

  const isButtonDisabled =
    !startDate ||
    !endDate ||
    !selectedSources.length ||
    !selectedCategories.length ||
    loading;

  const handleSourceChange = (source: string) => {
    setSelectedSources((prevSources) => {
      const isCurrentlySelected = prevSources.includes(source);

      if (isCurrentlySelected) {
        return prevSources.filter((s) => s !== source);
      } else {
        return [...prevSources, source];
      }
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prevCategories) => {
      const isCurrentlySelected = prevCategories.includes(category);

      if (isCurrentlySelected) {
        return prevCategories.filter((c) => c !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  };

  const handleGenerateReport = () => {
    setLoading(true);
    setReportVisible(false);

    setTimeout(() => {
      setLoading(false);
      setReportVisible(true);
    }, 2000);
  };

  return (
    <main className={`w-full p-8`}>
      <header className="mb-12 text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="bg-linear-to-b from-white to-white/70 bg-clip-text text-transparent">
            Media Trends
          </span>{' '}
          <span className="bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Analyser
          </span>
        </h1>
        <p className="mt-4 text-gray-400 text-lg max-w-2xl mx-auto">
          AI-powered insights across global news sources and social platforms.
        </p>
      </header>

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
            // max={todayDate}
            onChange={(event) => setEndDate(event.target.value)}
          />

          <Button
            onClick={handleGenerateReport}
            className="w-full sm:w-auto self-end"
            disabled={isButtonDisabled}
          >
            {loading ? 'Processing...' : 'Generate Report'}
          </Button>
        </div>
      </Box>

      {loading && (
        <div className="w-full flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-xl font-medium text-white">Analyzing Data...</h3>
          <p className="text-gray-400 text-sm mt-2">
            Aggregating trends from selected sources
          </p>
        </div>
      )}

      {!loading && reportVisible && (
        <Report
          startDate={startDate}
          endDate={endDate}
          selectedSources={selectedSources}
        />
      )}
    </main>
  );
}

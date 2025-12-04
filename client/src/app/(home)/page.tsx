'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { Report } from './Report';

const dataSources = ['Reddit', 'RSS Feeds', 'BBC', 'New York Times'];

export default function Home() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedSources, setSelectedSources] = useState<string[]>(dataSources);
  const [reportVisible, setReportVisible] = useState<boolean>(true);

  const todayDate = new Date().toISOString().slice(0, 10);

  const isButtonDisabled =
    !startDate || !endDate || selectedSources.length === 0;

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

  const handleGenerateReport = () => {
    console.log('clicked');
    setReportVisible(true);
  };

  return (
    <main className={`min-h-screen p-8 bg-black`}>
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white">
          Media Trends Analyser
        </h1>
      </header>

      <Box className="flex flex-col gap-6 mb-10">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center pt-4 border-t border-gray-800">
          {dataSources.map((source, index) => (
            <Checkbox
              key={source + index}
              checked={selectedSources.includes(source)}
              onChange={() => handleSourceChange(source)}
            >
              {source}
            </Checkbox>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-end border-b border-gray-800 pb-6 mx-auto max-w-4xl w-full">
          <DateInput
            id="startData"
            label="From:"
            value={startDate}
            max={todayDate}
            onChange={(e) => {
              const newStart = e.target.value;
              if (endDate && newStart > endDate) {
                setStartDate(endDate);
                setEndDate(newStart);
              } else {
                setStartDate(newStart);
              }
            }}
          />

          <DateInput
            id="endDate"
            label="To:"
            value={endDate}
            max={todayDate}
            onChange={(e) => {
              const newEnd = e.target.value;
              if (startDate && newEnd < startDate) {
                setEndDate(startDate);
                setStartDate(newEnd);
              } else {
                setEndDate(newEnd);
              }
            }}
          />

          <Button
            onClick={handleGenerateReport}
            className="w-full sm:w-auto ml-auto self-end"
            disabled={isButtonDisabled}
          >
            Generate Report
          </Button>
        </div>
      </Box>

      {reportVisible && (
        <Report
          startDate={startDate}
          endDate={endDate}
          selectedSources={selectedSources}
        />
      )}
    </main>
  );
}

'use client';

import { useState } from 'react';
import { ReportTab } from '@/components/ReportTab';
import { AnalyticsTab } from '@/components/AnalyticsTab';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';

const dataSources = ['X', 'Reddit', 'RSS Feeds', 'BBC', 'New York Times'];

export default function Home() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedSources, setSelectedSources] = useState<string[]>(dataSources);
  const [reportSummary, setReportSummary] = useState('Select time period.');
  const [activeTab, setActiveTab] = useState<'report' | 'analytics'>('report');

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

  const isButtonDisabled =
    !startDate || !endDate || selectedSources.length === 0;

  const handleGenerateReport = () => {
    console.log('Report for: ', {
      startDate,
      endDate,
      sources: selectedSources,
    });

    const sourcesList =
      selectedSources.length > 0
        ? selectedSources.join(', ')
        : 'No data source selected.';
    const summaryMessage = `Selected dates: ${startDate} - ${endDate}. Selected data sources: ${sourcesList}.`;

    setReportSummary(summaryMessage);
    setActiveTab('report');
  };

  const activeTabStyle =
    'border-b-2 border-blue-500 text-blue-500 font-semibold';
  const inactiveTabStyle =
    'border-b-2 border-transparent text-gray-400 hover:text-white';

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
            onChange={(e) => setStartDate(e.target.value)}
          />

          <DateInput
            id="endDate"
            label="To:"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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

      <nav className="flex mb-6 border-b border-gray-700 mx-auto max-w-4xl justify-center">
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-lg transition duration-150 ${
            activeTab === 'report' ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Report
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-lg transition duration-150 ${
            activeTab === 'analytics' ? activeTabStyle : inactiveTabStyle
          }`}
        >
          Trend Analytics
        </button>
      </nav>

      <section>
        {activeTab === 'report' && <ReportTab reportSummary={reportSummary} />}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            startDate={startDate}
            endDate={endDate}
            selectedSources={selectedSources}
          />
        )}
      </section>
    </main>
  );
}

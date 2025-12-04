'use client';

import { useState } from 'react';
import { ReportTab } from '@/components/ReportTab';
import { AnalyticsTab } from '@/components/AnalyticsTab';
import { Button } from '@/components/Button';
import { DateInput } from '@/components/DateInput';
import { Box } from '@/components/Box';
import { TabButton } from '@/components/TabButton';
import { mockTrendData, type TrendData } from '@/data/mocks';
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

const calculatePieData = (data: TrendData[]) => {
  const totals: { [key: string]: number } = {};
  data.forEach((point) => {
    Object.keys(point).forEach((key) => {
      const typedKey = key as keyof TrendData;
      if (key !== 'date') {
        totals[key] = (totals[key] || 0) + Number(point[typedKey]);
      }
    });
  });
  return Object.entries(totals).map(([name, value]) => ({ name, value }));
};

export default function Home() {
  const [selectedSources, setSelectedSources] = useState<string[]>(dataSources);
  const [reportSummary, setReportSummary] = useState('Select time period.');
  const [activeTab, setActiveTab] = useState<'report' | 'analytics'>('report');
  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(dataCategories);

  const getToday = () => new Date().toISOString().split('T')[0];
  const getYesterday = () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toISOString().split('T')[0];
  };
  const [startDate, setStartDate] = useState<string>(getYesterday());
  const [endDate, setEndDate] = useState<string>(getToday());

  const [filteredTrendData, setFilteredTrendData] = useState(mockTrendData);
  const [calculatedCategoryData, setCalculatedCategoryData] = useState(
    calculatePieData(mockTrendData)
  );

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
    const filteredData = mockTrendData.filter((item) => {
      return item.date >= startDate && item.date <= endDate;
    });

    setFilteredTrendData(filteredData);
    setCalculatedCategoryData(calculatePieData(filteredData));

    const sourcesList =
      selectedSources.length > 0
        ? selectedSources.join(', ')
        : 'No data source selected.';
    const summaryMessage = `Selected dates: ${startDate} - ${endDate}. Selected data sources: ${sourcesList}.`;

    setReportSummary(summaryMessage);
    setActiveTab('analytics');
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
            className="sm:mr-8"
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
            className="w-full sm:w-auto self-end"
            disabled={isButtonDisabled}
          >
            Generate Report
          </Button>
        </div>
      </Box>

      <nav className="flex mb-6 border-b border-gray-700 mx-auto max-w-4xl justify-center">
        <TabButton
          isActive={activeTab === 'report'}
          onClick={() => setActiveTab('report')}
        >
          Report
        </TabButton>
        <TabButton
          isActive={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        >
          Trend Analytics
        </TabButton>
      </nav>

      <section>
        {activeTab === 'report' && <ReportTab reportSummary={reportSummary} />}
        {activeTab === 'analytics' && (
          <AnalyticsTab
            startDate={startDate}
            endDate={endDate}
            selectedSources={selectedSources}
            categoryData={calculatedCategoryData}
            trendData={filteredTrendData}
          />
        )}
      </section>
    </main>
  );
}

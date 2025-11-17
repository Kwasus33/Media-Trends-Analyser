'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';
import ReportTab from '../components/reportTab';
import AnalyticsTab from '../components/analyticsTab';

const inter = Inter({ subsets: ['latin'] });

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
    <main className={`min-h-screen p-8 ${inter.className} bg-black`}>
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-extrabold text-white">
          Media Trends Analyser
        </h1>
      </header>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-200 mb-4"></h2>

        <div className="flex flex-col gap-6 p-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-700">
          <div className="pt-4 border-t border-gray-800">
            <h3 className="text-xl font-semibold text-white mb-2">
              Data Sources:
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {dataSources.map((source) => (
                <label
                  key={source}
                  className="inline-flex items-center text-gray-300"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => handleSourceChange(source)}
                    className="form-checkbox h-4 w-4 text-blue-600 bg-gray-700 border-gray-600 rounded"
                  />
                  <span className="ml-2 text-lg">{source}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-end border-b border-gray-800 pb-6">
            <div className="flex flex-col flex-grow">
              <label
                htmlFor="startDate"
                className="text-lg font-medium text-gray-400 mb-1"
              >
                From:
              </label>

              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border border-gray-500 rounded-md focus:border-gray-600 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-gray-700 text-white"
              />
            </div>

            <div className="flex flex-col flex-grow">
              <label
                htmlFor="endDate"
                className="text-lg font-medium text-gray-400 mb-1"
              >
                To:
              </label>

              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-gray-500 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 bg-gray-700 text-white"
              />
            </div>

            <button
              onClick={handleGenerateReport}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-700"
              disabled={isButtonDisabled}
            >
              Generate Report
            </button>
          </div>
        </div>
      </section>

      <nav className="flex mb-6 border-b border-gray-700">
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

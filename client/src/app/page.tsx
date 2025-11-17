'use client';

import { useState } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleGenerateReport = () => {
    console.log('Report for: ', { startDate, endDate });
  };

  return (
    <main className={`min-h-screen p-8 ${inter.className} bg-black`}>
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-white">
          Media Trends Analyser
        </h1>
        <p className="text-lg text-gray-200 mt-1">Something catchy</p>
      </header>

      <section className="mb-10">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">
          Choose time period
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white rounded-lg shadow-md border border-gray-500 items-end">
          <div className="flex flex-col flex-grow">
            <label
              htmlFor="startDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              From:
            </label>

            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-150"
            />
          </div>

          <div className="flex flex-col flex-grow">
            <label
              htmlFor="endDate"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              To:
            </label>

            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:border-gray-500 focus:ring focus:ring-gray-500 focus:ring-opacity-50 transition duration-150"
            />
          </div>

          <button
            onClick={handleGenerateReport}
            className="w-full sm:w-auto px-6 py-2 bg-gray-700 text-white font-semibold rounded-md shadow-lg hover:bg-gray-700 transition duration-200 disabled:bg-gray-400"
            disabled={!startDate || !endDate}
          >
            Generate Report
          </button>
        </div>
      </section>

      <section>
        <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 min-h-[500px]">
          <h2 className="text-2xl font-bold text-white mb-4">Report</h2>
          <p className="text-gray-400">Summary placeholder</p>
        </div>
      </section>
    </main>
  );
}

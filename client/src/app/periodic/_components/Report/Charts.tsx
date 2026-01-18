import { CategoryPieChart } from '@/components/charts/PieChart';
import { CategoryTrendChart } from '@/components/charts/LineChart';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ChartColumn, PieChart as PieIcon, Activity } from 'lucide-react';
import { type Category } from '@/constants/categories';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type CategoryData = {
  [Key in Category]?: number;
};

type TrendData = {
  date: string;
} & CategoryData;

type ChartsProps = {
  startDate: string;
  endDate: string;
  categoryData: CategoryData;
  trendData: TrendData[];
  isExport?: boolean;
};

const convertPieData = (data: CategoryData) => {
  return Object.keys(data).map((key) => {
    const typedKey = key as Category;
    return { name: typedKey, value: data[typedKey] };
  });
};

export function Charts({
  startDate,
  endDate,
  categoryData,
  trendData,
  isExport = false,
}: ChartsProps) {
  const isDesktop = useBreakpoint('sm');

  const categories = convertPieData(categoryData);
  const categoryNames = categories.map((c) => c.name);

  const pieInnerRadius = isDesktop ? undefined : 45;
  const pieOuterRadius = isDesktop ? undefined : 75;

  return (
    <SectionWrapper
      title="Data Visualization"
      icon={<ChartColumn className="w-6 h-6 text-green-600" />}
      className="flex flex-col gap-12 print:gap-6 print:break-inside-avoid"
    >
      {categories.length > 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1 flex flex-col gap-2 text-left">
              <div className="flex items-center gap-2 text-white font-bold text-xl">
                <PieIcon className="w-5 h-5 text-indigo-400" />
                <h3>Topic Share</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                A breakdown of total media volume across all selected sources.
                This highlights which categories are dominating the current
                narrative.
              </p>
            </div>

            <div className="md:col-span-2 bg-black/20 rounded-xl border border-white/5 p-6 min-h-75 flex flex-col">
              <CategoryPieChart
                data={categories}
                isExport={isExport}
                innerRadius={pieInnerRadius}
                outerRadius={pieOuterRadius}
              />
            </div>
          </div>
          <div className="w-full h-px bg-gray-800 print:hidden" />
        </>
      )}

      {trendData.length !== 0 && (
        <div className="flex flex-col gap-6 print:gap-4">
          <div className="flex flex-col gap-1 text-left">
            <div className="flex items-center gap-2 text-white font-bold text-xl">
              <Activity className="w-5 h-5 text-sky-400" />
              <h3>Timeline Evolution</h3>
            </div>
            <p className="text-gray-400 text-sm">
              Tracking the intensity of mentions over the selected period (
              {startDate} to {endDate}).
            </p>
          </div>

          <div className="w-full bg-black/20 rounded-xl border border-white/5 p-4">
            <CategoryTrendChart
              data={trendData}
              categories={categoryNames}
              isExport={isExport}
            />
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}

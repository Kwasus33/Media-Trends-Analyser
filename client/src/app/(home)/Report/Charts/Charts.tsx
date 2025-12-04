import { CategoryPieChart } from './PieChart';
import { CategoryTrendChart } from './LineChart';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ChartColumn, PieChart as PieIcon, Activity } from 'lucide-react';

type TrendData = {
  date: string;
  Technology?: number;
  Politics?: number;
  Economy?: number;
  Sport?: number;
  Culture?: number;
};

type CategoryKeys = keyof Omit<TrendData, 'date'>;

type CategoryData = {
  [Key in CategoryKeys]?: number;
};

type ChartsProps = {
  startDate: string;
  endDate: string;
  categoryData: CategoryData;
  trendData: TrendData[];
};

const convertPieData = (data: CategoryData) => {
  return Object.keys(data).map((key) => {
    const typedKey = key as CategoryKeys;
    return { name: typedKey, value: data[typedKey] };
  });
};

export function Charts({
  startDate,
  endDate,
  categoryData,
  trendData,
}: ChartsProps) {
  const categories = convertPieData(categoryData);
  const categoryNames = categories.map((c) => c.name);

  return (
    <SectionWrapper
      title="Data Visualization"
      icon={<ChartColumn className="w-6 h-6 text-green-600" />}
      className="flex flex-col gap-12"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="md:col-span-1 flex flex-col gap-2 text-left">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <PieIcon className="w-5 h-5 text-indigo-400" />
            <h3>Topic Share</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            A breakdown of total media volume across all selected sources. This
            highlights which categories are dominating the current narrative.
          </p>
        </div>

        <div className="md:col-span-2 bg-black/20 rounded-xl border border-white/5 p-4">
          <CategoryPieChart data={categories} />
        </div>
      </div>

      <div className="w-full h-px bg-gray-800" />

      <div className="flex flex-col gap-6">
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
          <CategoryTrendChart data={trendData} categories={categoryNames} />
        </div>
      </div>
    </SectionWrapper>
  );
}

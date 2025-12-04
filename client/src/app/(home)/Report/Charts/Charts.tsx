import { CategoryPieChart } from './PieChart';
import { CategoryTrendChart } from './LineChart';
import { SectionWrapper } from '@/components/SectionWrapper';
import { ChartColumn } from 'lucide-react';

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

export function Charts({ categoryData, trendData }: ChartsProps) {
  const categories = convertPieData(categoryData);
  const categoryNames = categories.map((c) => c.name);

  return (
    <SectionWrapper
      title="Data Visualization"
      icon={<ChartColumn className="w-6 h-6 text-green-600" />}
    >
      <CategoryPieChart data={categories} />

      <CategoryTrendChart data={trendData} categories={categoryNames} />
    </SectionWrapper>
  );
}

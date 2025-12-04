import { CategoryPieChart } from './PieChart';
import { CategoryTrendChart } from './LineChart';

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
    <div>
      <h2 className="text-3xl font-bold text-white mb-4">Trend Analytics</h2>

      <CategoryPieChart data={categories} />

      <CategoryTrendChart data={trendData} categories={categoryNames} />
    </div>
  );
}

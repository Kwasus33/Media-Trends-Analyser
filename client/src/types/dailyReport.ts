import type { Category } from '@/constants/categories';
import type { Source } from '@/constants/sources';

type SourceCategoryData<T> = Record<Source, Record<Category, T>>;

export type DailyReport = {
  date: string;
  has_data: boolean;
  summaries?: SourceCategoryData<string>;
  categories?: SourceCategoryData<number>;
};

export type TopCategory = {
  category: string;
  percent: number;
};

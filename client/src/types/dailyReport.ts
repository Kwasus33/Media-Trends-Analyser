import type { Category } from '@/constants/categories';
import type { Source } from '@/constants/sources';

type SourceCategoryData<T> = Record<Source, Record<Category, T>>;

export type DailyReport = {
  date: string;
  summaries: SourceCategoryData<string>;
  categories: SourceCategoryData<number>;
};

import { type Source } from '@/constants/sources';

export type PeriodicReport = {
  main_summary: string;
  categories_timeline: Array<{
    date: string;
    [category: string]: string | number;
  }>;
  category_totals: Record<string, number>;
  trends: {
    rising: string[];
    declining: string[];
    emerging: string[];
  };
  key_insights: string[];
  source_highlights: Record<Source, string>;
  event_timeline: Record<string, string>;
  references: Record<Source, string[]>;
};

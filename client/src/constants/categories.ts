const constCategories = [
  'Technology',
  'Politics',
  'Economy',
  'Sport',
  'Culture',
  'Society',
] as const;

export type Category = (typeof constCategories)[number];

export const CATEGORIES = [...constCategories];

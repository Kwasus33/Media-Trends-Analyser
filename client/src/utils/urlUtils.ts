import type { ReadonlyURLSearchParams } from 'next/navigation';
import type { PeriodicFilters } from '@/types/periodicReport';
import { SOURCES } from '@/constants/sources';
import { CATEGORIES } from '@/constants/categories';

const KEYS = {
  SOURCE: 's',
  CATEGORY: 'c',
  FROM: 'f',
  TO: 't',
};

function getCanonicalValues(
  rawParam: string | null,
  validMap: Record<string, unknown>
): string[] {
  if (!rawParam) return [];

  const validKeys = Object.keys(validMap);

  return rawParam
    .split(',')
    .map((item) => item.trim())
    .map((slug) => {
      return validKeys.find((key) => key.toLowerCase() === slug.toLowerCase());
    })
    .filter((key): key is string => Boolean(key));
}

export function parseSearchParams(
  params:
    | URLSearchParams
    | ReadonlyURLSearchParams
    | Record<string, string | string[] | undefined>
): PeriodicFilters {
  const get = (key: string): string | null => {
    if (!params) return null;

    if ('get' in params && typeof params.get === 'function') {
      return params.get(key);
    }

    const value = (params as Record<string, string | string[]>)[key];
    return Array.isArray(value) ? value[0] : value || null;
  };

  return {
    source: getCanonicalValues(get(KEYS.SOURCE), SOURCES),
    category: getCanonicalValues(get(KEYS.CATEGORY), CATEGORIES),
    from: get(KEYS.FROM) || '',
    to: get(KEYS.TO) || '',
  };
}

export function toQueryString(filters: Partial<PeriodicFilters>): string {
  const params = new URLSearchParams();

  if (filters.source?.length) {
    const lowerSources = filters.source.map((source) => source.toLowerCase());
    params.set(KEYS.SOURCE, lowerSources.join(','));
  }

  if (filters.category?.length) {
    const lowerCats = filters.category.map((cat) => cat.toLowerCase());
    params.set(KEYS.CATEGORY, lowerCats.join(','));
  }

  if (filters.from) {
    params.set(KEYS.FROM, filters.from);
  }

  if (filters.to) {
    params.set(KEYS.TO, filters.to);
  }

  return params.toString();
}

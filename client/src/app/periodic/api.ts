'use server';

import { unstable_cache } from 'next/cache';
import { env } from '@/env';
import type { PeriodicReport } from '@/types/periodicReport';

type PeriodicFilters = {
  source?: string | string[];
  category?: string | string[];
  from?: string;
  to?: string;
};

export type TaskStatus = {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result: PeriodicReport | null;
  error: string | null;
};

export const getPeriodicTaskId = unstable_cache(
  async (filters: PeriodicFilters) => {
    const baseUrl = env.API_URL || '';
    const params = new URLSearchParams();

    if (filters.from) params.append('start', filters.from);
    if (filters.to) params.append('end', filters.to);

    const sources = Array.isArray(filters.source)
      ? filters.source
      : [filters.source || ''].filter(Boolean);

    const categories = Array.isArray(filters.category)
      ? filters.category
      : [filters.category || ''].filter(Boolean);

    sources.forEach((source) => params.append('sources', source));
    categories.forEach((categories) => params.append('categories', categories));

    const response = await fetch(
      `${baseUrl}/agent/api/v1/periodic_summary/start?${params.toString()}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start: ${response.statusText}`);
    }

    const data = await response.json();
    return data.task_id as string;
  },
  ['periodic-task-id-v1'],
  { revalidate: 3600, tags: ['periodic-tasks'] }
);

export async function checkTaskStatus(taskId: string): Promise<TaskStatus> {
  const baseUrl = env.API_URL || '';

  const response = await fetch(
    `${baseUrl}/agent/api/v1/periodic_summary/status/${taskId}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to check status');
  }

  return response.json();
}

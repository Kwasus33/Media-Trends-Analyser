'use server';

import { unstable_cache } from 'next/cache';
import { env } from '@/env';
import type { PeriodicReport, PeriodicFilters } from '@/types/periodicReport';

export type TaskStatus = {
  task_id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'not_found';
  result: PeriodicReport | null;
  error: string | null;
};

async function fetchAgent<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${env.API_URL}/agent/api/v1${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'api-key': env.VM_SECRET,
      ...options.headers,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ API Error [${path}] (${response.status}): ${errorText}`);
    throw new Error(errorText || `Request failed: ${response.status}`);
  }

  return response.json();
}

export async function startPeriodicTask(filters: PeriodicFilters) {
  const params = new URLSearchParams();

  if (filters.from) params.set('start', filters.from);
  if (filters.to) params.set('end', filters.to);

  filters.source?.forEach((s) => params.append('sources', s));
  filters.category?.forEach((c) => params.append('categories', c));

  console.log(`[PERIODIC START] Requesting task for: ${params.toString()}`);

  const data = await fetchAgent<{ task_id: string }>(
    `/periodic_summary/start?${params.toString()}`,
    { method: 'POST' }
  );

  console.log(`[PERIODIC START] ✅ Success. Task ID: ${data.task_id}`);

  return data.task_id;
}

export const getPeriodicTaskId = unstable_cache(
  startPeriodicTask,
  ['periodic-task-id-v1'],
  { revalidate: 3600, tags: ['periodic-tasks'] }
);

export async function checkTaskStatus(taskId: string): Promise<TaskStatus> {
  console.log(`[PERIODIC STATUS] Polling ID: ${taskId}`);

  const response = await fetchAgent<TaskStatus>(
    `/periodic_summary/status/${taskId}`,
    {
      method: 'GET',
    }
  );

  console.log(
    `[PERIODIC STATUS] Task ${taskId} has status: ${response.status}`
  );

  return response;
}

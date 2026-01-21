import { parseSearchParams } from '@/utils/urlUtils';
import { ClientWrapper } from './ClientWrapper';
import { getPeriodicTaskId, checkTaskStatus, startPeriodicTask } from './api';

type HomeProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const rawParams = await searchParams;

  const filters = parseSearchParams(rawParams);

  const paramsKey = JSON.stringify(filters);

  const hasFilters = filters.source.length > 0 || filters.category.length > 0;

  let initialData = null;
  let taskId: string | null = null;
  let initialError: string | null = null;

  if (hasFilters) {
    try {
      taskId = await getPeriodicTaskId(filters);

      let task = await checkTaskStatus(taskId);

      if (task.status == 'not_found') {
        console.warn(
          `Stale cache detected for Task ${taskId}. Starting fresh task.`
        );

        taskId = await startPeriodicTask(filters);
        task = await checkTaskStatus(taskId);
      }

      if (task.status === 'completed' && task.result) {
        initialData = task.result;
      } else if (task.status === 'failed') {
        initialError = 'Report generation failed on the server.';
      }
    } catch (error) {
      console.error('Periodic Page Load Error:', error);
      initialError = 'Failed to initiate report generation.';
    }
  }

  const startDate = typeof filters.from === 'string' ? filters.from : '';
  const endDate = typeof filters.to === 'string' ? filters.to : '';

  return (
    <ClientWrapper
      key={paramsKey}
      initialData={initialData}
      taskId={taskId}
      initialError={initialError}
      startDate={startDate}
      endDate={endDate}
      searchParamsKey={paramsKey}
    />
  );
}

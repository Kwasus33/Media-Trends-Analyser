import type { DailyReport } from '@/types/dailyReport';
import { env } from '@/env';

export async function fetchDailyReports(): Promise<DailyReport[]> {
  const url = `${env.API_URL}/agent/api/v1/daily_summary/recent`;

  const revalidateTime = 3600;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'api-key': env.VM_SECRET,
      },
      next: {
        revalidate: revalidateTime,
      },
    });

    const dateHeader = response.headers.get('date');
    if (dateHeader) {
      const responseDate = new Date(dateHeader).getTime();
      const now = new Date().getTime();
      const ageInSeconds = (now - responseDate) / 1000;

      if (ageInSeconds > 2) {
        console.log(
          `[DAILY REPORTS] CACHE HIT! Serving data from ${ageInSeconds.toFixed(0)}s ago.`
        );
      } else {
        console.log(
          `[DAILY REPORTS] NETWORK REQUEST! Fetched fresh data just now.`
        );
      }
    } else {
      console.warn(
        '[DAILY REPORTS] Response missing Date header, cannot determine cache status.'
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API Error (${response.status}): ${errorBody || response.statusText}`
      );
    }

    const data = (await response.json()) as DailyReport[];

    data.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return data;
  } catch (error) {
    console.error('❌ Fetch Daily Reports failed:', error);
    throw error;
  }
}

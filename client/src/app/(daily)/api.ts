import type { DailyReport } from '@/types/dailyReport';
import { env } from '@/env';

// function getRevalidateTime() {
//   const now = new Date();
//   const target = new Date(now);

//   target.setHours(1, 0, 0, 0);

//   if (now >= target) {
//     target.setDate(target.getDate() + 1);
//   }

//   const secondsUntilUpdate = Math.floor(
//     (target.getTime() - now.getTime()) / 1000
//   );

//   return Math.max(60, secondsUntilUpdate);
// }

export async function fetchDailyReports(): Promise<DailyReport[]> {
  const url = `${env.API_URL}/agent/api/v1/daily_summary/recent`;

  // const revalidateTime = getRevalidateTime();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      // next: {
      //   revalidate: revalidateTime,
      // },
    });

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
    console.error('Fetch Daily Reports failed:', error);
    throw error;
  }
}

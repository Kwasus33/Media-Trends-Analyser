import { Box } from '@/components/Box';
import { DailyHeader } from './_components/DailyHeader';
import { LoadingState } from '@/components/LoadingState';

export default function Loading() {
  return (
    <Box>
      <DailyHeader />

      <LoadingState
        title="Fetching Reports..."
        description="Retrieving daily analysis and statistics"
        className="-mt-8"
      />
    </Box>
  );
}

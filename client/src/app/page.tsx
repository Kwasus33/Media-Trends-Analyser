'use client';

import { Button } from '@/components/Button';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [count, setCount] = useState<number>(0);

  const handleClick = () => {
    setCount((count) => count + 1);
  };

  return (
    <div>
      <Button onClick={handleClick} className="m-4">
        Clicked {count} times
      </Button>
      <Link href="/test">Go to test page</Link>
    </div>
  );
}

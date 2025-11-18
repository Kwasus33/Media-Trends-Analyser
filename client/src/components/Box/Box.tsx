import type { HTMLAttributes } from 'react';

type BoxProps = HTMLAttributes<HTMLDivElement>;

export function Box({ className, ...props }: BoxProps) {
  return (
    <div
      className={`bg-gray-900 p-6 rounded-xl shadow-2xl border border-gray-700 mx-auto max-w-7xl ${className}`}
      {...props}
    />
  );
}

import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'>;

export function Button({ className, ref, children, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={`rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

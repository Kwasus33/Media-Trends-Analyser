import type { ComponentProps } from 'react';

type ButtonProps = ComponentProps<'button'>;

export function Button({ className, ref, children, ...props }: ButtonProps) {
  return (
    <button
      ref={ref}
      className={`
        rounded-full bg-indigo-600 px-8 py-3 text-white font-semibold shadow-lg shadow-indigo-500/30
        transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98]
        disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

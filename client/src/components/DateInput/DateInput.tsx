'use client';

import type { ComponentProps, ChangeEvent } from 'react';

type DateInputProps = ComponentProps<'input'> & {
  label: string;
};

export function DateInput({
  id,
  label,
  className,
  value,
  onChange,
  min,
  ...props
}: DateInputProps) {
  const adjustDate = (days: number) => {
    if (!value) return;

    const date = new Date(value as string);
    date.setDate(date.getDate() + days);

    const newDate = date.toISOString().split('T')[0];

    if (min && newDate < (min as string)) return;

    if (onChange) {
      onChange({ target: { value: newDate } } as ChangeEvent<HTMLInputElement>);
    }
  };

  const isMinReached = min && value ? value <= min : false;

  return (
    <div className={`flex flex-col w-60 ${className}`}>
      <label
        htmlFor={id}
        className="text-xs font-semibold text-gray-400/60 uppercase tracking-wider mb-2 ml-1"
      >
        {label}
      </label>

      <div className="flex items-stretch">
        <button
          type="button"
          onClick={() => adjustDate(-1)}
          disabled={isMinReached}
          className={`px-3 h-12 bg-slate-800 border border-indigo-500/30 disabled:cursor-default rounded-l-lg border-r-0 text-indigo-400 transition-all ${
            isMinReached
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <input
          id={id}
          type="date"
          value={value}
          min={min}
          onChange={onChange}
          className="flex-1 h-12 min-w-0 border border-indigo-500/30 bg-slate-800 text-indigo-100 text-base font-medium focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none scheme-dark flex items-center justify-center cursor-pointer"
          {...props}
        />

        <button
          type="button"
          onClick={() => adjustDate(1)}
          className="px-3 h-12 bg-slate-800 border border-indigo-500/30 rounded-r-lg border-l-0 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 text-indigo-400 transition-all"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

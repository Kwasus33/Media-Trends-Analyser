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
  ...props
}: DateInputProps) {
  const adjustDate = (days: number) => {
    if (!value) return;

    const date = new Date(value as string);
    date.setDate(date.getDate() + days);

    const newDate = date.toISOString().split('T')[0];

    if (onChange) {
      onChange({ target: { value: newDate } } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className={`flex flex-col w-48 ${className}`}>
      <label htmlFor={id} className="text-lg font-medium text-gray-400 mb-1">
        {label}
      </label>

      <div className="flex items-stretch shadow-sm">
        <button
          type="button"
          onClick={() => adjustDate(-1)}
          className="px-2 bg-gray-700 border border-gray-500 rounded-l-md border-r-0 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 .755l-14.374 11.245 14.374 11.219-.619.781-15.381-12 15.391-12 .609.755z"
            />
          </svg>
        </button>

        <input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          className="flex-1 p-2 min-w-0 border border-gray-500 bg-gray-700 text-white text-center focus:ring-0 focus:outline-none [color-scheme:dark]"
          {...props}
        />

        <button
          type="button"
          onClick={() => adjustDate(1)}
          className="px-2 bg-gray-700 border border-gray-500 rounded-r-md border-l-0 hover:bg-gray-600 text-gray-300 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-3 h-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 .755l14.374 11.245-14.374 11.219.619.781 15.381-12-15.391-12-.609.755z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

import React from 'react';

type CategorySelectorProps = {
  category: string;
  checked: boolean;
  onChange: () => void;
};

export const CategorySelector = ({
  category,
  checked,
  onChange,
}: CategorySelectorProps) => {
  return (
    <label
      className={`
        cursor-pointer px-5 py-2 text-base rounded-full border transition-all duration-300 select-none transform
        ${
          checked
            ? 'scale-100 font-bold border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
            : 'scale-95 font-medium text-gray-400 border-gray-800 bg-gray-900/50 hover:border-gray-600 hover:text-gray-300'
        }
      `}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        onChange={onChange}
      />
      {category}
    </label>
  );
};

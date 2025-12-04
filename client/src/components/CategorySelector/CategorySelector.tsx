import React from 'react';

interface CategorySelectorProps {
  category: string;
  checked: boolean;
  onChange: () => void;
}

export const CategorySelector = ({
  category,
  checked,
  onChange,
}: CategorySelectorProps) => {
  return (
    <label
      className={`cursor-pointer px-4 py-1.5 text-sm border rounded-xl transition-all duration-300 select-none
        ${
          checked
            ? 'font-bold border-2 text-white border-white bg-gray-800'
            : 'font-medium text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-300'
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

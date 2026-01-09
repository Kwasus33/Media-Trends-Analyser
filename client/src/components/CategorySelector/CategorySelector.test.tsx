import { render, screen, fireEvent } from '@testing-library/react';
import { CategorySelector } from './CategorySelector';

describe('CategorySelector', () => {
  it('renders category name', () => {
    render(
      <CategorySelector
        category="Politics"
        checked={false}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText('Politics')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(
      <CategorySelector
        category="Politics"
        checked={false}
        onChange={handleChange}
      />
    );

    fireEvent.click(screen.getByText('Politics'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

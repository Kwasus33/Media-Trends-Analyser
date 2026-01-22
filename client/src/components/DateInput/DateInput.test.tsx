import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from './DateInput';

jest.mock('@/utils/dateUtils', () => ({
  getISODate: (date: Date) => {
    return date.toISOString().split('T')[0];
  },
}));

describe('DateInput', () => {
  it('renders label and input with correct value', () => {
    render(
      <DateInput
        id="test-date"
        label="Start Date"
        value="2026-01-01"
        onChange={jest.fn()}
      />
    );

    expect(screen.getByLabelText('Start Date')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-01-01')).toBeInTheDocument();
  });

  it('calls onChange when value changes', () => {
    const handleChange = jest.fn();
    render(
      <DateInput
        id="test-date"
        label="Start Date"
        value="2026-01-01"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Start Date');
    fireEvent.change(input, { target: { value: '2026-01-07' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('passes min and max attributes correctly', () => {
    render(
      <DateInput
        id="test-date"
        label="Date"
        value="2026-01-05"
        min="2026-01-01"
        max="2026-01-07"
        onChange={jest.fn()}
      />
    );

    const input = screen.getByLabelText('Date');
    expect(input).toHaveAttribute('min', '2026-01-01');
    expect(input).toHaveAttribute('max', '2026-01-07');
  });

  it('increments date when right arrow is clicked', () => {
    const handleChange = jest.fn();
    render(
      <DateInput
        id="test-date"
        label="Date"
        value="2026-01-01"
        onChange={handleChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[1];

    fireEvent.click(nextButton);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: '2026-01-02' },
      })
    );
  });

  it('decrements date when left arrow is clicked', () => {
    const handleChange = jest.fn();
    render(
      <DateInput
        id="test-date"
        label="Date"
        value="2026-01-05"
        onChange={handleChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];

    fireEvent.click(prevButton);

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: { value: '2026-01-04' },
      })
    );
  });

  it('disables previous button when min date is reached', () => {
    const handleChange = jest.fn();
    render(
      <DateInput
        id="test-date"
        label="Date"
        value="2026-01-01"
        min="2026-01-01"
        onChange={handleChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];

    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveClass('opacity-30');
    expect(prevButton).toHaveClass('cursor-not-allowed');

    fireEvent.click(prevButton);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('does not crash if value is missing', () => {
    const handleChange = jest.fn();
    render(
      <DateInput
        id="test-date"
        label="Date"
        value={undefined}
        onChange={handleChange}
      />
    );

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]);

    expect(handleChange).not.toHaveBeenCalled();
  });
});

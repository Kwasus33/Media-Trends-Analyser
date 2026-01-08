import { render, screen, fireEvent } from '@testing-library/react';
import { DateInput } from './DateInput';

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
});

import { render, screen, fireEvent } from '@testing-library/react';
import { SourceSelector } from './SourceSelector';

describe('SourceSelector', () => {
  it('renders source name', () => {
    render(
      <SourceSelector source="BBC" checked={false} onChange={jest.fn()} />
    );

    expect(screen.getByText('BBC')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(
      <SourceSelector source="BBC" checked={false} onChange={handleChange} />
    );

    fireEvent.click(screen.getByText('BBC'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it('renders checked state correctly', () => {
    const { container } = render(
      <SourceSelector source="BBC" checked={true} onChange={jest.fn()} />
    );

    expect(container.firstChild).toHaveClass('border-indigo-500');
  });
});

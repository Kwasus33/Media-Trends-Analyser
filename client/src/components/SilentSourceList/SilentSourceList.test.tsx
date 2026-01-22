// cspell:ignore Kacper Siemionek
import { render, screen } from '@testing-library/react';
import { SilentSourceList } from './SilentSourceList';
import { type Source } from '@/constants/sources';

jest.mock('@/constants/sources', () => ({
  getSourceConfig: () => ({
    border: 'border-test-mock',
    bg: 'bg-test-mock',
    color: 'text-test-mock',
  }),
}));

describe('SilentSourceList', () => {
  it('renders nothing when sources list is empty', () => {
    const { container } = render(
      <SilentSourceList sources={[]} label="No data found" />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('renders label and list of sources when data is present', () => {
    const sources = ['BBC', 'CNN'] as Source[];
    const label = 'Kacper Siemionek';

    render(<SilentSourceList sources={sources} label={label} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByText('BBC')).toBeInTheDocument();
    expect(screen.getByText('CNN')).toBeInTheDocument();
  });

  it('styling', () => {
    const sources = ['BBC'] as Source[];
    render(<SilentSourceList sources={sources} label="Label" />);

    const sourceElement = screen.getByText('BBC').parentElement;

    expect(sourceElement).toHaveClass('border-test-mock');
    expect(screen.getByText('BBC')).toHaveClass('text-test-mock');
  });
});

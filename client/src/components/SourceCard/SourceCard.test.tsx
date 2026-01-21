import { render, screen, fireEvent } from '@testing-library/react';
import { SourceCard } from './SourceCard';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { type Category } from '@/constants/categories';

jest.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}));

jest.mock('@/components/TextExpander', () => ({
  TextExpander: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="text-expander">{children}</div>
  ),
}));

jest.mock('@/constants/sources', () => ({
  getSourceConfig: () => ({
    icon: <span data-testid="source-icon" />,
    color: 'text-test-color',
    bg: 'bg-test-bg',
    border: 'border-test-border',
  }),
}));

jest.mock('@/constants/categories', () => ({
  getCategoryConfig: () => ({
    bg: 'bg-cat-bg',
    text: 'text-cat-text',
    border: 'border-cat-border',
  }),
}));

describe('SourceCard', () => {
  const defaultProps = {
    source: 'BBC' as const,
    text: 'Kacper Siemionek śliczny jak zawsze, szokuje nową, wilczą stylizacją. Fanki wyją z zachwytu, a ich liczba na prezentacji końcowej PZSP2 przekroczyła 5-krotnie normy BHP.',
  };

  beforeEach(() => {
    (useBreakpoint as jest.Mock).mockReturnValue(true);
  });

  it('renders source information correctly', () => {
    render(<SourceCard {...defaultProps} />);

    expect(screen.getByText('BBC')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Kacper Siemionek śliczny jak zawsze, szokuje nową, wilczą stylizacją. Fanki wyją z zachwytu, a ich liczba na prezentacji końcowej PZSP2 przekroczyła 5-krotnie normy BHP.'
      )
    ).toBeInTheDocument();
    expect(screen.getByTestId('source-icon')).toBeInTheDocument();
  });

  it('renders categories sorted by count', () => {
    const categoryCounts = {
      Politics: 30,
      Technology: 70,
      Business: 0,
    };

    render(
      <SourceCard
        {...defaultProps}
        categoryCounts={categoryCounts as unknown as Record<Category, number>}
      />
    );

    const categories = screen.getAllByText(/Technology|Politics/);
    expect(categories[0]).toHaveTextContent('Technology');
    expect(categories[1]).toHaveTextContent('Politics');
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(screen.queryByText('Business')).not.toBeInTheDocument();
  });

  it('handles reference links visibility', () => {
    const urls = ['https://kacpersiemionek.com', 'https://siemionekkacper.com'];
    render(<SourceCard {...defaultProps} urls={urls} />);

    const toggleBtn = screen.getByRole('button');
    expect(screen.getByText('2 References')).toBeInTheDocument();
    expect(
      screen.queryByText('https://kacpersiemionek.com')
    ).not.toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(screen.getByText('https://kacpersiemionek.com')).toBeInTheDocument();
    expect(screen.getByText('https://siemionekkacper.com')).toBeInTheDocument();

    fireEvent.click(toggleBtn);
    expect(
      screen.queryByText('https://kacpersiemionek.com')
    ).not.toBeInTheDocument();
  });

  it('doesnt render reference section when no urls present', () => {
    render(<SourceCard {...defaultProps} urls={[]} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('closes references dropdown when clicking somewhere else', () => {
    const urls = ['https://kacpersiemionek.com'];
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <SourceCard {...defaultProps} urls={urls} />
      </div>
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('https://kacpersiemionek.com')).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByTestId('outside'));
    expect(
      screen.queryByText('https://kacpersiemionek.com')
    ).not.toBeInTheDocument();
  });
});

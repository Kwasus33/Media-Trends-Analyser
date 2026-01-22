import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Header', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  it('renders title and description correctly', () => {
    render(<Header />);

    expect(screen.getByText('Media Trends')).toBeInTheDocument();
    expect(screen.getByText('Analyser')).toBeInTheDocument();
    expect(
      screen.getByText(/AI-powered insights across global news sources/i)
    ).toBeInTheDocument();
  });

  it('highlights Daily Summary link', () => {
    (usePathname as jest.Mock).mockReturnValue('/');
    render(<Header />);

    const dailyLink = screen.getByText('Daily Summary').closest('a');
    const periodicLink = screen.getByText('Periodic Report').closest('a');

    expect(dailyLink).toHaveClass('bg-indigo-600');
    expect(periodicLink).not.toHaveClass('bg-indigo-600');
    expect(periodicLink).toHaveClass('text-gray-400');
  });

  it('highlights Periodic Report link', () => {
    (usePathname as jest.Mock).mockReturnValue('/periodic');
    render(<Header />);

    const dailyLink = screen.getByText('Daily Summary').closest('a');
    const periodicLink = screen.getByText('Periodic Report').closest('a');

    expect(periodicLink).toHaveClass('bg-indigo-600');
    expect(dailyLink).not.toHaveClass('bg-indigo-600');
    expect(dailyLink).toHaveClass('text-gray-400');
  });
});

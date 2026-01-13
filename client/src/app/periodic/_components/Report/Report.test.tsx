import { render, screen, fireEvent } from '@testing-library/react';
import { Report } from './Report';
import type { PeriodicReport } from '@/types/periodicReport';

jest.mock('./Charts', () => ({
  Charts: () => <div data-testid="mock-charts">Charts Component</div>,
}));
jest.mock('./TrendAnalysis', () => ({
  TrendAnalysis: () => (
    <div data-testid="mock-trend-analysis">Trends Component</div>
  ),
}));
jest.mock('./KeyInsights', () => ({
  KeyInsights: () => (
    <div data-testid="mock-key-insights">Insights Component</div>
  ),
}));
jest.mock('./SourceHighlights', () => ({
  SourceHighlights: () => (
    <div data-testid="mock-source-highlights">Highlights Component</div>
  ),
}));
jest.mock('./EventTimeline', () => ({
  EventTimeline: () => (
    <div data-testid="mock-event-timeline">Timeline Component</div>
  ),
}));
jest.mock('/src/components/ShareButton', () => ({
  ShareButton: () => <button>Share</button>,
}));

const mockData = {
  main_summary: 'This is a test summary of the report.',
  trends: [],
  key_insights: [],
  source_highlights: [],
  references: [],
  event_timeline: [],
  category_totals: {},
  categories_timeline: [],
} as unknown as PeriodicReport;

describe('Report', () => {
  it('renders the main summary and dates correctly', () => {
    render(
      <Report data={mockData} startDate="2026-01-01" endDate="2026-01-03" />
    );

    expect(screen.getByText('Trend Report')).toBeInTheDocument();
    expect(screen.getByText('2026-01-01')).toBeInTheDocument();
    expect(screen.getByText('2026-01-03')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test summary of the report.')
    ).toBeInTheDocument();
  });

  it('renders all child sections', () => {
    render(
      <Report data={mockData} startDate="2026-01-01" endDate="2026-01-03" />
    );

    expect(screen.getByTestId('mock-trend-analysis')).toBeInTheDocument();
    expect(screen.getByTestId('mock-key-insights')).toBeInTheDocument();
    expect(screen.getByTestId('mock-source-highlights')).toBeInTheDocument();
    expect(screen.getByTestId('mock-event-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('mock-charts')).toBeInTheDocument();
  });

  it('calls onPrint when print button is clicked', () => {
    const handlePrint = jest.fn();
    render(
      <Report
        data={mockData}
        startDate="2026-01-01"
        endDate="2026-01-03"
        onPrint={handlePrint}
      />
    );

    const printBtn = screen.getByText(/Export PDF/i);
    fireEvent.click(printBtn);

    expect(handlePrint).toHaveBeenCalledTimes(1);
  });

  it('hides interactive buttons in export mode', () => {
    render(
      <Report
        data={mockData}
        startDate="2026-01-01"
        endDate="2026-01-03"
        isExport={true}
        onPrint={jest.fn()}
      />
    );

    expect(screen.queryByText(/Export PDF/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Share/i)).not.toBeInTheDocument();
  });
});

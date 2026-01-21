import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ControlPanel } from './ControlPanel';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

interface SelectorProps {
  source?: string;
  category?: string;
  checked: boolean;
  onChange: () => void;
}

jest.mock('/src/components/SourceSelector', () => ({
  SourceSelector: ({ source, checked, onChange }: SelectorProps) => (
    <div data-testid="source-selector">
      <label>
        {source}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          data-testid={`checkbox-${source}`}
        />
      </label>
    </div>
  ),
}));

jest.mock('/src/components/CategorySelector', () => ({
  CategorySelector: ({ category, checked, onChange }: SelectorProps) => (
    <div data-testid="category-selector">
      <label>
        {category}
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          data-testid={`checkbox-${category}`}
        />
      </label>
    </div>
  ),
}));

describe('ControlPanel', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
    (useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams());
  });

  it('renders with default values when URL params are empty', () => {
    render(
      <ControlPanel>
        <div data-testid="child-content">Content</div>
      </ControlPanel>
    );

    const bbcCheckbox = screen.getByTestId(/^checkbox-BBC/);
    expect(bbcCheckbox).toBeChecked();

    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('initializes state from URL parameters', () => {
    const params = new URLSearchParams();

    params.append('s', 'interia');
    params.append('c', 'technology');

    (useSearchParams as jest.Mock).mockReturnValue(params);

    render(
      <ControlPanel>
        <div>Content</div>
      </ControlPanel>
    );

    expect(screen.getByTestId('checkbox-Interia')).toBeChecked();
    expect(screen.getByTestId('checkbox-BBC')).not.toBeChecked();
    expect(screen.getByTestId('checkbox-Technology')).toBeChecked();
    expect(screen.getByTestId('checkbox-Politics')).not.toBeChecked();
  });

  it('updates selected sources when clicked', () => {
    render(
      <ControlPanel>
        <div>Content</div>
      </ControlPanel>
    );

    const InteriaCheckbox = screen.getByTestId('checkbox-Interia');

    expect(InteriaCheckbox).toBeChecked();

    fireEvent.click(InteriaCheckbox);
    expect(InteriaCheckbox).not.toBeChecked();

    fireEvent.click(InteriaCheckbox);
    expect(InteriaCheckbox).toBeChecked();
  });

  it('generates correct URL and navigates on submit', async () => {
    render(
      <ControlPanel>
        <div>Content</div>
      </ControlPanel>
    );

    const bbcCheckbox = screen.getByTestId('checkbox-BBC');
    const InteriaCheckbox = screen.getByTestId('checkbox-Interia');

    fireEvent.click(bbcCheckbox);
    fireEvent.click(InteriaCheckbox);

    const generateBtn = screen.getByText(/Generate Report/i);
    fireEvent.click(generateBtn);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalled();
    });

    const callArgs = mockPush.mock.calls[0][0];

    expect(callArgs).toContain('s=');
    expect(callArgs).toContain('newyorktimes');
    expect(callArgs).not.toMatch(/s=.*bbc/);
    expect(callArgs).not.toMatch(/s=.*interia/);
  });

  it('disables submit button if required fields are missing', () => {
    render(
      <ControlPanel>
        <div>Content</div>
      </ControlPanel>
    );

    const allSources = screen
      .getAllByTestId(/^checkbox-/)
      .filter(
        (el) =>
          el.getAttribute('data-testid')?.includes('TVN24') ||
          el.getAttribute('data-testid')?.includes('Interia') ||
          el.getAttribute('data-testid')?.includes('BBC') ||
          el.getAttribute('data-testid')?.includes('NewYorkTimes')
      );

    allSources.forEach((checkbox) => {
      if ((checkbox as HTMLInputElement).checked) {
        fireEvent.click(checkbox);
      }
    });

    const generateBtn = screen.getByText(/Generate Report/i);
    expect(generateBtn).toBeDisabled();
  });
});

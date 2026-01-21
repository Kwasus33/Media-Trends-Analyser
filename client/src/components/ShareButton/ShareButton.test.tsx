import { render, screen, fireEvent, act } from '@testing-library/react';
import { ShareButton } from './ShareButton';
import { useBreakpoint } from '@/hooks/useBreakpoint';

jest.mock('@/hooks/useBreakpoint', () => ({
  useBreakpoint: jest.fn(),
}));

jest.mock('@/components/Button', () => ({
  Button: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
}));

describe('ShareButton', () => {
  const mockWriteText = jest.fn();
  const originalClipboard = navigator.clipboard;

  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });
  });

  afterAll(() => {
    Object.assign(navigator, {
      clipboard: originalClipboard,
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useBreakpoint as jest.Mock).mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly on desktop', () => {
    render(<ShareButton />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders correctly on mobile', () => {
    (useBreakpoint as jest.Mock).mockReturnValue(false);
    render(<ShareButton />);
    expect(screen.queryByText('Share')).not.toBeInTheDocument();
  });

  it('copies current url to clipboard', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<ShareButton />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(mockWriteText).toHaveBeenCalledWith(window.location.href);
  });

  it('changes look after copying', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<ShareButton />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied Link')).toBeInTheDocument();
  });

  it('reverts to init state after timeout', async () => {
    mockWriteText.mockResolvedValue(undefined);
    render(<ShareButton />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(screen.getByText('Copied Link')).toBeInTheDocument();

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('handles clipboard errors', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    mockWriteText.mockRejectedValue(new Error('Clipboard error'));

    render(<ShareButton />);

    const button = screen.getByRole('button');
    await act(async () => {
      fireEvent.click(button);
    });

    expect(consoleSpy).toHaveBeenCalled();
    expect(screen.getByText('Share')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});

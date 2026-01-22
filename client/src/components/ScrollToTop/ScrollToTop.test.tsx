import { render, screen, fireEvent } from '@testing-library/react';
import { ScrollToTop } from './ScrollToTop';

describe('ScrollToTop', () => {
  const scrollMock = jest.fn();

  beforeAll(() => {
    Object.defineProperty(window, 'scrollTo', { value: scrollMock });
  });

  beforeEach(() => {
    scrollMock.mockClear();
    fireEvent.scroll(window, { target: { scrollY: 0 } });
  });

  it('hidden at first', () => {
    render(<ScrollToTop />);
    const button = screen.getByLabelText('Scroll to top');
    expect(button).toHaveClass('opacity-0');
    expect(button).toHaveClass('pointer-events-none');
  });

  it('becomes visible after threshold', () => {
    render(<ScrollToTop />);
    const button = screen.getByLabelText('Scroll to top');

    fireEvent.scroll(window, { target: { scrollY: 400 } });

    expect(button).toHaveClass('opacity-100');
    expect(button).not.toHaveClass('opacity-0');
  });

  it('hides again when scrolling up', () => {
    render(<ScrollToTop />);
    const button = screen.getByLabelText('Scroll to top');

    fireEvent.scroll(window, { target: { scrollY: 400 } });
    expect(button).toHaveClass('opacity-100');

    fireEvent.scroll(window, { target: { scrollY: 100 } });
    expect(button).toHaveClass('opacity-0');
  });

  it('scrolls to top when clicked', () => {
    render(<ScrollToTop />);
    const button = screen.getByLabelText('Scroll to top');

    fireEvent.scroll(window, { target: { scrollY: 400 } });
    fireEvent.click(button);

    expect(scrollMock).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});

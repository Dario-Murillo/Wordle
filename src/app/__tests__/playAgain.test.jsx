import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EndModal from '../../components/EndModal';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

describe('jugar de nuevo', () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useRouter.mockReturnValue({ push: mockPush });

    // Replace with a mock manually
    Object.defineProperty(window, 'localStorage', {
      value: {
        clear: vi.fn(),
      },
      writable: true,
    });

    // Mock reload
    vi.stubGlobal('location', {
      ...window.location,
      reload: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('se limpia localStorage y refresca la pagina al hacer click en Jugar', () => {
    render(<EndModal isCorrect solution="perro" modalVisible />);

    const jugarButton = screen.getByRole('button', { name: /jugar/i });

    fireEvent.click(jugarButton);

    expect(window.location.reload).toHaveBeenCalled();
  });
});

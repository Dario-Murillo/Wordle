import { expect, describe, it, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ScoreTable from '../../components/ScoreTable';
import * as supabaseClient from '../../utils/supabase/client';

vi.mock('../../utils/supabase/client', () => {
  const signOut = vi.fn(() => ({ error: null }));
  const getUser = vi.fn(() =>
    Promise.resolve({
      data: {
        user: { id: '948509834', email: 'dariomurillochaverri@gmail.com' },
      },
    }),
  );

  const from = () => ({
    select: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          user_id: 'user-123',
          palabra: 'PIANO',
          adivinada: true,
          intentos: 2,
          fecha: '2025-06-08',
        },
        {
          id: 2,
          user_id: 'user-123',
          palabra: 'RIVER',
          adivinada: false,
          intentos: 3,
          fecha: '2025-06-09',
        },
      ],
      error: null,
    }),
  });
  const createClient = vi.fn(() => ({
    auth: { signOut, getUser },
    from,
  }));

  return {
    default: createClient,
    __esModule: true,
    signOut,
    getUser,
    from,
    createClient,
  };
});

describe('Score Table', () => {
  const user = { id: 'user-123', email: 'test@correo.com' };

  it('muestra la información obtenida del from', async () => {
    render(<ScoreTable user={user} />);
    expect(await screen.findByText('PIANO')).toBeInTheDocument();
    expect(screen.getByText('Sí')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2025-06-08')).toBeInTheDocument();
  });

  it('filtra los resultados por palabra', async () => {
    render(<ScoreTable user={user} />);

    await screen.findByText('PIANO');
    const input = screen.getByPlaceholderText(/buscar por palabra o fecha/i);
    fireEvent.change(input, { target: { value: 'PIA' } });
    expect(screen.getByText('PIANO')).toBeInTheDocument();
    expect(screen.queryByText('RIVER')).not.toBeInTheDocument();
  });

  it('filtra los resultados por fecha', async () => {
    render(<ScoreTable user={user} />);
    await screen.findByText('PIANO');
    const input = screen.getByPlaceholderText(/buscar por palabra o fecha/i);
    fireEvent.change(input, { target: { value: '2025-06-09' } });
    expect(screen.getByText('RIVER')).toBeInTheDocument();
    expect(screen.queryByText('PIANO')).not.toBeInTheDocument();
  });

  it('muestra la paginación y cambia de página', async () => {
    // Genera 15 registros para probar la paginación (ITEMS_PER_PAGE = 10)
    const data = Array.from({ length: 15 }, (_, i) => ({
      id: i + 1,
      user_id: 'user-123',
      palabra: `Palabra${i + 1}`,
      adivinada: i % 2 === 0,
      intentos: i + 1,
      fecha: `2025-06-${String(i + 1).padStart(2, '0')}T23:26:36.128176+00:00`,
    }));

    supabaseClient.default.mockReturnValue({
      from: () => ({
        select: vi.fn().mockResolvedValue({ data, error: null }),
      }),
    });

    render(<ScoreTable user={user} />);
    // Espera a que cargue la data
    await screen.findByText('Palabra1');
    // Debe mostrar solo 10 resultados en la primera página
    expect(screen.getByText('Palabra1')).toBeInTheDocument();
    expect(screen.getByText('Palabra10')).toBeInTheDocument();
    expect(screen.queryByText('Palabra11')).not.toBeInTheDocument();

    // Cambia a la página 2
    fireEvent.click(screen.getByRole('button', { name: /siguiente/i }));
    await waitFor(() => {
      expect(screen.getByText('Palabra11')).toBeInTheDocument();
    });
    expect(screen.queryByText('Palabra1')).not.toBeInTheDocument();
  });
});

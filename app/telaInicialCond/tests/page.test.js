import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TelaInicialCond from '../page';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

jest.mock('next/navigation');
jest.mock('next-auth/react');

describe('TelaInicialCond', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useRouter.mockReturnValue({
      push: mockPush,
    });

    useSession.mockReturnValue({
      data: null,
      status: 'unauthenticated',
    });
  });

  // ============================================
  // TESTE 1: Renderiza sem erros
  // ============================================
  test('renderiza a página sem erros', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 2: Mostra os dados corretos
  // ============================================
  test('mostra os dados mockados', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('34')).toBeInTheDocument();
      expect(screen.getByText('Pets cadastrados')).toBeInTheDocument();
      expect(screen.getByText('Pets perdidos')).toBeInTheDocument();
      expect(screen.getByText('Donos cadastrados')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 3: Navega ao clicar nos cards
  // ============================================
  test('navega para /pets ao clicar no card', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('Pets cadastrados')).toBeInTheDocument();
    });

    const card = screen.getByText('Pets cadastrados').closest('.dashboard-card');
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith('/pets');
  });

  // ============================================
  // TESTE 4: Mostra alerta de pets perdidos
  // ============================================
  test('mostra alerta quando há pets perdidos', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      const alertIcon = document.querySelector('.alert-icon');
      expect(alertIcon).toBeInTheDocument();
    });
  });
});
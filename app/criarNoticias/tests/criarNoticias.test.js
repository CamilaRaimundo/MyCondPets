import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock do banco de dados ANTES de importar o componente
jest.mock('../../_lib/db', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

// CORREÇÃO: O componente é o default export de page.jsx
import CriarNoticias from '../page';

// Mock do fetch global
global.fetch = jest.fn();

// Mock do window.location
const mockLocation = { href: '' };
delete window.location;
window.location = mockLocation;

// Mock do window.history.back
const mockHistoryBack = jest.fn();
window.history.back = mockHistoryBack;

describe('CriarNoticias Component', () => {
  const mockDonos = [
    { don_id: '1', don_nome: 'João Silva' },
    { don_id: '2', don_nome: 'Maria Santos' },
    { don_id: '3', don_nome: 'Pedro Oliveira' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
    window.location.href = '';
    
    // Mock padrão para carregar donos - SEMPRE retorna array
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockDonos
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Helper para esperar o carregamento inicial
  const waitForLoadingToFinish = async () => {
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  };

  describe('Renderização Inicial', () => {
    it('deve exibir loading ao carregar donos', async () => {
      render(<CriarNoticias />);
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
      
      await waitForLoadingToFinish();
    });

    it('deve renderizar o formulário após carregar donos', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      // Busca pelo heading específico para evitar duplicatas
      expect(screen.getByRole('heading', { name: /Publicar Notícia/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/Título da Notícia/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Publicado por/i)).toBeInTheDocument();
    });

    it('deve carregar e exibir lista de donos no select', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('João Silva');
      expect(select).toHaveTextContent('Maria Santos');
      expect(select).toHaveTextContent('Pedro Oliveira');
    });

    it('deve exibir mensagem de erro ao falhar ao carregar donos', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ details: 'Erro no servidor' })
      });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText(/Erro ao carregar lista de donos/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });
  });

  describe('Validação de Formulário', () => {
    it('deve validar título vazio ao submeter', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const submitButton = screen.getByRole('button', { name: /Public/i })
      
      fireEvent.click(submitButton);

      // Verifica que o alert de erro aparece
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Por favor, insira um título/i);
      }, { timeout: 5000 });
    });

    it('deve validar descrição vazia ao submeter', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      fireEvent.change(tituloInput, { target: { value: 'Título de teste' } });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      // Verifica que o alert de erro aparece
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Por favor, insira uma descrição/i);
      }, { timeout: 5000 });
    });

    it('deve validar dono não selecionado ao submeter', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);

      fireEvent.change(tituloInput, { target: { value: 'Título de teste' } });
      fireEvent.change(descricaoInput, { target: { value: 'Descrição de teste' } });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      // Verifica que o alert de erro aparece
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Por favor, selecione um dono/i);
      }, { timeout: 5000 });
    });
  });

  describe('Interação com Formulário', () => {
    it('deve atualizar campo de título ao digitar', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      fireEvent.change(tituloInput, { target: { value: 'Golden Retriever perdido' } });

      expect(tituloInput.value).toBe('Golden Retriever perdido');
    });

    it('deve atualizar campo de descrição e contador de caracteres', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const textoTeste = 'Pet perdido próximo ao bloco A';
      
      fireEvent.change(descricaoInput, { target: { value: textoTeste } });

      expect(descricaoInput.value).toBe(textoTeste);
      expect(screen.getByText(`${textoTeste.length}/500 caracteres`)).toBeInTheDocument();
    });

    it('deve selecionar um dono no select', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '2' } });

      expect(select.value).toBe('2');
    });

    it('deve fechar mensagem de erro ao clicar no X', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      // Forçar uma mensagem de erro submetendo sem dados
      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      // Verifica que o alert aparece
      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/Por favor, insira um título/i);
      }, { timeout: 5000 });

      const closeButton = screen.getByRole('button', { name: /Fechar mensagem/i });
      fireEvent.click(closeButton);

      // Verifica que o alert foi removido
      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Submissão de Formulário', () => {
    it('deve submeter formulário com sucesso', async () => {
      // Primeiro fetch para donos, segundo para submissão
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, id: '123' })
        });

      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const select = screen.getByRole('combobox');

      fireEvent.change(tituloInput, { target: { value: 'Golden perdido' } });
      fireEvent.change(descricaoInput, { target: { value: 'Perdido no parque' } });
      fireEvent.change(select, { target: { value: '1' } });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Notícia publicada com sucesso!')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Verifica se o fetch foi chamado corretamente
      expect(global.fetch).toHaveBeenCalledWith('/api/noticias', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: 'Golden perdido',
          descricao: 'Perdido no parque',
          donId: '1'
        })
      });
    });

    it('deve exibir loading durante submissão', async () => {
      // Mock que demora para responder
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockImplementationOnce(() => 
          new Promise(resolve => 
            setTimeout(() => resolve({
              ok: true,
              json: async () => ({ success: true })
            }), 100)
          )
        );

      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const select = screen.getByRole('combobox');

      await act(async () => {
        fireEvent.change(tituloInput, { target: { value: 'Teste' } });
        fireEvent.change(descricaoInput, { target: { value: 'Teste descrição' } });
        fireEvent.change(select, { target: { value: '1' } });
      });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      
      await act(async () => {
        fireEvent.click(submitButton);
      });

      // Verifica se o botão está desabilitado durante o loading
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      }, { timeout: 500 });

      // Aguarda a conclusão
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      }, { timeout: 3000 });
    });

    it('deve exibir mensagem de erro ao falhar submissão', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Erro ao salvar notícia', details: 'Erro ao salvar notícia' })
        });

      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const select = screen.getByRole('combobox');

      fireEvent.change(tituloInput, { target: { value: 'Teste' } });
      fireEvent.change(descricaoInput, { target: { value: 'Teste descrição' } });
      fireEvent.change(select, { target: { value: '1' } });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Erro ao salvar notícia/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('deve redirecionar após sucesso', async () => {
      jest.useFakeTimers();

      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      render(<CriarNoticias />);

      // Aguarda carregamento com fake timers
      await act(async () => {
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const select = screen.getByRole('combobox');

      await act(async () => {
        fireEvent.change(tituloInput, { target: { value: 'Teste' } });
        fireEvent.change(descricaoInput, { target: { value: 'Teste descrição' } });
        fireEvent.change(select, { target: { value: '1' } });
      });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      
      await act(async () => {
        fireEvent.click(submitButton);
        jest.runAllTimers();
      });

      await waitFor(() => {
        expect(screen.getByText('Notícia publicada com sucesso!')).toBeInTheDocument();
      });

      // Avança o timer do setTimeout(2000)
      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(window.location.href).toBe('/noticias');

      jest.useRealTimers();
    });

    it('deve limpar formulário após sucesso', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const tituloInput = screen.getByLabelText(/Título da Notícia/i);
      const descricaoInput = screen.getByLabelText(/Descrição/i);
      const select = screen.getByRole('combobox');

      fireEvent.change(tituloInput, { target: { value: 'Teste' } });
      fireEvent.change(descricaoInput, { target: { value: 'Teste descrição' } });
      fireEvent.change(select, { target: { value: '1' } });

      const submitButton = screen.getByRole('button', { name: /Public/i })
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(tituloInput.value).toBe('');
        expect(descricaoInput.value).toBe('');
        expect(select.value).toBe('');
      }, { timeout: 5000 });
    });
  });

  describe('Botão Cancelar', () => {
    it('deve voltar para página anterior ao clicar em cancelar', async () => {
      render(<CriarNoticias />);

      await waitForLoadingToFinish();

      const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
      fireEvent.click(cancelButton);

      expect(mockHistoryBack).toHaveBeenCalled();
    });
  });
});
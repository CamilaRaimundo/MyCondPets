import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CriarNoticias from '../page';

// Mock do fetch
global.fetch = jest.fn();

// Mock do window.location
const mockLocation = { href: '' };
delete window.location;
window.location = mockLocation;

// Mock do window.history
const mockBack = jest.fn();
window.history.back = mockBack;

describe('CriarNoticias', () => {
  const mockDonos = [
    { don_id: 1, don_nome: 'João Silva', don_email: 'joao@email.com' },
    { don_id: 2, don_nome: 'Maria Santos', don_email: 'maria@email.com' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocation.href = '';
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockDonos
    });
  });

  describe('Renderização inicial', () => {
    it('deve mostrar loading enquanto carrega donos', () => {
      fetch.mockReset();
      fetch.mockImplementationOnce(() => new Promise(() => {}));
      
      render(<CriarNoticias />);
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve renderizar o formulário após carregar donos', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/título da notícia/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/descrição/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/publicado por/i)).toBeInTheDocument();
    });

    it('deve carregar a lista de donos no select', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('João Silva')).toBeInTheDocument();
        expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro se falhar ao carregar donos', async () => {
      fetch.mockReset();
      fetch.mockRejectedValueOnce(new Error('Erro de conexão'));

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText(/erro ao carregar lista de donos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Validação do formulário', () => {
    it('deve mostrar erro quando título está vazio', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Por favor, insira um título')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro quando descrição está vazia', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      await userEvent.type(tituloInput, 'Título teste');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Por favor, insira uma descrição')).toBeInTheDocument();
      });
    });

    it('deve mostrar erro quando dono não é selecionado', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);

      await userEvent.type(tituloInput, 'Título teste');
      await userEvent.type(descricaoInput, 'Descrição teste');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Por favor, selecione um dono')).toBeInTheDocument();
      });
    });
  });

  describe('Envio do formulário', () => {
    it('deve enviar formulário com sucesso', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Notícia publicada com sucesso!' })
        });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);
      const donoSelect = screen.getByLabelText(/publicado por/i);

      await userEvent.type(tituloInput, 'Cachorro perdido');
      await userEvent.type(descricaoInput, 'Cachorro marrom perdido no bloco A');
      await userEvent.selectOptions(donoSelect, '1');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Notícia publicada com sucesso!')).toBeInTheDocument();
      });

      expect(fetch).toHaveBeenCalledWith('/api/noticias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titulo: 'Cachorro perdido',
          descricao: 'Cachorro marrom perdido no bloco A',
          donId: '1'
        })
      });
    });

    it('deve mostrar erro quando API falha', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: false,
          json: async () => ({ error: 'Erro ao criar notícia', details: 'Erro no servidor' })
        });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);
      const donoSelect = screen.getByLabelText(/publicado por/i);

      await userEvent.type(tituloInput, 'Título teste');
      await userEvent.type(descricaoInput, 'Descrição teste');
      await userEvent.selectOptions(donoSelect, '1');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Erro no servidor')).toBeInTheDocument();
      });
    });

    it('deve mostrar estado de loading durante envio', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockImplementationOnce(() => new Promise(() => {}));

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);
      const donoSelect = screen.getByLabelText(/publicado por/i);

      await userEvent.type(tituloInput, 'Título teste');
      await userEvent.type(descricaoInput, 'Descrição teste');
      await userEvent.selectOptions(donoSelect, '1');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Publicando...')).toBeInTheDocument();
      });
    });
  });

  describe('Interações do usuário', () => {
    it('deve atualizar contador de caracteres da descrição', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const descricaoInput = screen.getByLabelText(/descrição/i);
      await userEvent.type(descricaoInput, 'Teste');

      expect(screen.getByText('5/500 caracteres')).toBeInTheDocument();
    });

    it('deve fechar mensagem ao clicar no X', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Por favor, insira um título')).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText('Fechar mensagem');
      fireEvent.click(closeButton);

      expect(screen.queryByText('Por favor, insira um título')).not.toBeInTheDocument();
    });

    it('deve voltar ao clicar em Cancelar', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('deve limpar formulário após sucesso', async () => {
      fetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockDonos
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'Notícia publicada com sucesso!' })
        });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText('Publicar Notícia')).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);
      const donoSelect = screen.getByLabelText(/publicado por/i);

      await userEvent.type(tituloInput, 'Cachorro perdido');
      await userEvent.type(descricaoInput, 'Descrição teste');
      await userEvent.selectOptions(donoSelect, '1');

      const submitButton = screen.getByRole('button', { name: /publicar notícia/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Notícia publicada com sucesso!')).toBeInTheDocument();
      });

      expect(tituloInput).toHaveValue('');
      expect(descricaoInput).toHaveValue('');
      expect(donoSelect).toHaveValue('');
    });
  });
});
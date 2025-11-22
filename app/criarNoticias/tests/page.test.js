import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CriarNoticias from '../page';

// Mock do fetch
global.fetch = jest.fn();

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
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockDonos
    });
  });

  describe('Renderização inicial', () => {
    it('deve mostrar loading enquanto carrega donos', () => {
      fetch.mockImplementation(() => new Promise(() => {}));
      
      render(<CriarNoticias />);
      
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });

    it('deve renderizar o formulário após carregar donos', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
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
      fetch.mockRejectedValue(new Error('Erro de conexão'));

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByText(/erro ao carregar lista de donos/i)).toBeInTheDocument();
      });
    });
  });

  describe('Envio do formulário', () => {
    it('deve enviar formulário com sucesso', async () => {
      let callCount = 0;
      fetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => mockDonos
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Notícia publicada com sucesso!' })
        });
      });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
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
    });

    it('deve mostrar erro quando API falha', async () => {
      let callCount = 0;
      fetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => mockDonos
          });
        }
        return Promise.resolve({
          ok: false,
          json: async () => ({ error: 'Erro ao criar notícia', details: 'Erro no servidor' })
        });
      });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
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
      let callCount = 0;
      fetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => mockDonos
          });
        }
        return new Promise(() => {});
      });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
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
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
      });

      const descricaoInput = screen.getByLabelText(/descrição/i);
      await userEvent.type(descricaoInput, 'Teste');

      expect(screen.getByText('5/500 caracteres')).toBeInTheDocument();
    });

    it('deve voltar ao clicar em Cancelar', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      fireEvent.click(cancelButton);

      expect(mockBack).toHaveBeenCalled();
    });

    it('deve preencher todos os campos do formulário', async () => {
      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
      });

      const tituloInput = screen.getByLabelText(/título da notícia/i);
      const descricaoInput = screen.getByLabelText(/descrição/i);
      const donoSelect = screen.getByLabelText(/publicado por/i);

      await userEvent.type(tituloInput, 'Meu título');
      await userEvent.type(descricaoInput, 'Minha descrição');
      await userEvent.selectOptions(donoSelect, '1');

      expect(tituloInput).toHaveValue('Meu título');
      expect(descricaoInput).toHaveValue('Minha descrição');
      expect(donoSelect).toHaveValue('1');
    });

    it('deve limpar formulário após sucesso', async () => {
      let callCount = 0;
      fetch.mockImplementation(() => {
        callCount++;
        if (callCount === 1) {
          return Promise.resolve({
            ok: true,
            json: async () => mockDonos
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ message: 'Notícia publicada com sucesso!' })
        });
      });

      render(<CriarNoticias />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'Publicar Notícia' })).toBeInTheDocument();
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

      await waitFor(() => {
        expect(tituloInput).toHaveValue('');
        expect(descricaoInput).toHaveValue('');
        expect(donoSelect).toHaveValue('');
      });
    });
  });
});
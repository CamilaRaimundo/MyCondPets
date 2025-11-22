// ============================================
// TESTES DA TELA INICIAL (TelaInicialCond)
// ============================================

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TelaInicialCond from '../page';
import { Footer } from '../../../components/footer/index'; 
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Mocks
jest.mock('next/navigation');
jest.mock('next-auth/react');
global.fetch = jest.fn();

// CORREÇÃO CRÍTICA: Mocka scrollIntoView para evitar TypeError no JSDOM (Footer tests)
// Isso simula o comportamento do navegador para elementos HTML.
if (typeof Element !== 'undefined') {
  Element.prototype.scrollIntoView = jest.fn();
}

describe('TelaInicialCond - Dashboard Principal', () => {
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

    // Mock da API do dashboard
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        petsCadastrados: 34,
        petsPerdidos: 5,
        donosCadastrados: 28,
        aptosComPets: 20
      })
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
  // TESTE 2: Mostra loading inicialmente
  // ============================================
  test('mostra loading ao carregar dados', () => {
    render(<TelaInicialCond />);
    
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  // ============================================
  // TESTE 3: Mostra os dados corretos da API
  // ============================================
  test('mostra os dados mockados da API', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('34')).toBeInTheDocument();
      expect(screen.getByText('Pets cadastrados')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('Pets perdidos')).toBeInTheDocument();
      expect(screen.getByText('28')).toBeInTheDocument();
      expect(screen.getByText('Donos cadastrados')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
      expect(screen.getByText('Apartamentos com pets')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 4: Faz chamada à API corretamente
  // ============================================
  test('faz chamada para /api/dashboard ao montar', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard');
    });
  });

  // ============================================
  // TESTE 5: Mostra alerta quando há pets perdidos
  // CORREÇÃO: Checa a classe CSS (.alert-icon)
  // ============================================
  test('mostra alerta quando há pets perdidos', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      // O componente usa a classe CSS .alert-icon para o ícone de alerta
      expect(document.querySelector('.alert-icon')).toBeInTheDocument(); 
    });
  });

  // ============================================
  // TESTE 6: NÃO mostra alerta quando não há pets perdidos
  // CORREÇÃO: Checa a classe CSS (.alert-icon)
  // ============================================
  test('não mostra alerta quando não há pets perdidos', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        petsCadastrados: 34,
        petsPerdidos: 0,
        donosCadastrados: 28,
        aptosComPets: 20
      })
    });

    render(<TelaInicialCond />);
    
    await waitFor(() => {
      // Verifica a AUSÊNCIA do elemento com a classe CSS .alert-icon
      expect(document.querySelector('.alert-icon')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 7: Renderiza todos os cards
  // ============================================
  test('renderiza todos os 4 cards principais', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('Pets cadastrados')).toBeInTheDocument();
      expect(screen.getByText('Pets perdidos')).toBeInTheDocument();
      expect(screen.getByText('Donos cadastrados')).toBeInTheDocument();
      expect(screen.getByText('Apartamentos com pets')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 8: Mostra erro quando API falha
  // ============================================
  test('mostra erro quando a API falha', async () => {
    fetch.mockRejectedValueOnce(new Error('Erro ao carregar dados'));
    
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText(/Erro ao carregar dados/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 9: Botão "Tentar novamente" funciona
  // ============================================
  test('botão "Tentar novamente" recarrega os dados', async () => {
    // 1. Falha inicial
    fetch.mockRejectedValueOnce(new Error('Erro'));
    
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('Tentar novamente')).toBeInTheDocument();
    });

    // 2. Sucesso no retry
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        petsCadastrados: 34,
        petsPerdidos: 5,
        donosCadastrados: 28,
        aptosComPets: 20
      })
    });

    const retryButton = screen.getByText('Tentar novamente');
    fireEvent.click(retryButton);

    await waitFor(() => {
      // Verifica se os dados carregaram após o retry
      expect(screen.getByText('34')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 10: CORRIGIDO. Checa a mensagem de erro (Database connection failed).
  // Quando response.ok é false, o componente renderiza o bloco de erro, não os dados 0.
  // ============================================
  test('mostra mensagem de erro quando API retorna erro 500', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'Erro ao buscar dados do dashboard',
        details: 'Database connection failed'
      })
    });

    render(<TelaInicialCond />);

    await waitFor(() => {
      // O componente exibe a mensagem de erro que vem do 'details' da API
      expect(screen.getByText(/Database connection failed/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 11: Card de Notícias renderiza corretamente
  // ============================================
  test('renderiza o card de Notícias com link', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      expect(screen.getByText('Notícias')).toBeInTheDocument();
      expect(screen.getByText('Ver todas')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 12: Verifica cores dos cards
  // ============================================
  test('aplica as classes de cor corretas aos cards', async () => {
    render(<TelaInicialCond />);
    
    await waitFor(() => {
      const cards = document.querySelectorAll('.dashboard-card');
      // A ordem é 0, 1, 2 para os 3 cards do topo
      expect(cards[0]).toHaveClass('card-teal');
      expect(cards[1]).toHaveClass('card-red');
      expect(cards[2]).toHaveClass('card-dark-teal');
    });
  });
});

// ============================================
// TESTES DO FOOTER E CHATBOT
// ============================================

describe('Footer - Chatbot', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        petsCadastrados: 34,
        petsPerdidos: 5,
        donosCadastrados: 28,
        aptosComPets: 20
      })
    });
  });

  // ============================================
  // TESTE 1: Renderiza o rodapé
  // ============================================
  test('renderiza o rodapé com copyright', () => {
    render(<Footer />);
    expect(screen.getByText('Copyright - 2025')).toBeInTheDocument();
  });

  // ============================================
  // TESTE 2: Botão do chatbot aparece
  // ============================================
  test('exibe o botão de abrir chatbot inicialmente', () => {
    render(<Footer />);
    const chatButton = screen.getByLabelText('Abrir chat');
    expect(chatButton).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
  });

  // ============================================
  // TESTE 3: Abre o chatbot
  // ============================================
  test('abre a janela do chatbot ao clicar no botão', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('Assistente Virtual')).toBeInTheDocument();
      expect(screen.getByText('Sempre online')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 4: Fecha o chatbot
  // ============================================
  test('fecha a janela do chatbot ao clicar no X', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('Assistente Virtual')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Fechar chat');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Assistente Virtual')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 5: Mensagem inicial do bot
  // ============================================
  test('exibe a mensagem de boas-vindas do bot', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText(/Olá! 👋 Sou o assistente virtual do condomínio/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 6: Botões de ação rápida
  // ============================================
  test('exibe todos os botões de ação rápida', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('📊 Estatísticas')).toBeInTheDocument();
      expect(screen.getByText('🐕 Cadastrar Pet')).toBeInTheDocument();
      expect(screen.getByText('🚨 Pet Perdido')).toBeInTheDocument();
      expect(screen.getByText('📰 Notícias')).toBeInTheDocument();
      expect(screen.getByText('🏠 Apartamentos')).toBeInTheDocument();
      expect(screen.getByText('❓ Ajuda')).toBeInTheDocument();
      expect(screen.getByText('📞 Contato')).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 7: Carrega dados da API
  // ============================================
  test('carrega dados do dashboard ao montar o componente', async () => {
    render(<Footer />);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/dashboard');
    });
  });

  // ============================================
  // TESTE 8: Clique em Estatísticas
  // CORREÇÃO: Regex mais flexível sem emojis rígidos
  // ============================================
  test('ao clicar em Estatísticas, mostra os dados do dashboard', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('📊 Estatísticas')).toBeInTheDocument();
    });

    const statsButton = screen.getByText('📊 Estatísticas');
    fireEvent.click(statsButton);

    await waitFor(() => {
      // Os textos são verificados por regex flexível (ignora emojis específicos)
      expect(screen.getByText(/Pets cadastrados: 34/i)).toBeInTheDocument();
      expect(screen.getByText(/Pets perdidos: 5/i)).toBeInTheDocument();
      expect(screen.getByText(/Donos cadastrados: 28/i)).toBeInTheDocument();
      expect(screen.getByText(/Apartamentos com pets: 20/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 9: Clique em Ajuda
  // ============================================
  test('ao clicar em Ajuda, mostra informações do sistema', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('❓ Ajuda')).toBeInTheDocument();
    });

    const helpButton = screen.getByText('❓ Ajuda');
    fireEvent.click(helpButton);

    await waitFor(() => {
      expect(screen.getByText(/sistema completo de controle de pets/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 10: Clique em Contato
  // ============================================
  test('ao clicar em Contato, mostra informações de contato', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('📞 Contato')).toBeInTheDocument();
    });

    const contactButton = screen.getByText('📞 Contato');
    fireEvent.click(contactButton);

    await waitFor(() => {
      expect(screen.getByText(/Condomínio Residencial Jardim das Flores/i)).toBeInTheDocument();
      expect(screen.getByText(/admin@condjardimdflores.com.br/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 11: Adiciona mensagem do usuário
  // ============================================
  test('adiciona mensagem do usuário ao clicar em ação rápida', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('📰 Notícias')).toBeInTheDocument();
    });

    const newsButton = screen.getByText('📰 Notícias');
    fireEvent.click(newsButton);

    await waitFor(() => {
      const userMessages = screen.getAllByText('📰 Notícias');
      // Espera-se que haja a mensagem do botão e a nova mensagem na conversa.
      expect(userMessages.length).toBeGreaterThan(1);
    });
  });

  // ============================================
  // TESTE 12: Tratamento de erro na API
  // CORREÇÃO: Usa expect.stringContaining para ignorar emojis e ser menos rígido
  // ============================================
  test('trata erro ao carregar dados do dashboard', async () => {
    fetch.mockRejectedValueOnce(new Error('Erro na API'));
    
    // Espia console.error para verificar se o erro foi logado corretamente
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<Footer />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao carregar dados no Footer'),
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  // ============================================
  // TESTE 13: Clique em Pet Perdido
  // ============================================
  test('ao clicar em Pet Perdido, mostra informações sobre sistema de alertas', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('🚨 Pet Perdido')).toBeInTheDocument();
    });

    const lostButton = screen.getByText('🚨 Pet Perdido');
    fireEvent.click(lostButton);

    await waitFor(() => {
      expect(screen.getByText(/Sistema de Pets Perdidos/i)).toBeInTheDocument();
      expect(screen.getByText(/Registro rápido de desaparecimento/i)).toBeInTheDocument();
    });
  });

  // ============================================
  // TESTE 14: Timestamps nas mensagens
  // ============================================
  test('mensagens exibem timestamp formatado', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      // Procura por qualquer texto no formato HH:MM
      const timestamps = screen.getAllByText(/\d{2}:\d{2}/);
      expect(timestamps.length).toBeGreaterThan(0);
    });
  });

  // ============================================
  // TESTE 15: Múltiplas interações
  // ============================================
  test('permite múltiplas interações seguidas', async () => {
    render(<Footer />);
    
    const chatButton = screen.getByLabelText('Abrir chat');
    fireEvent.click(chatButton);

    await waitFor(() => {
      expect(screen.getByText('📊 Estatísticas')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('📊 Estatísticas'));
    
    await waitFor(() => {
      expect(screen.getByText(/Pets cadastrados: 34/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('❓ Ajuda'));
    
    await waitFor(() => {
      expect(screen.getByText(/sistema completo de controle de pets/i)).toBeInTheDocument();
    });
  });
});
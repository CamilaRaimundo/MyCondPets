import { render, screen, waitFor } from '@testing-library/react';
import CadastroPage from '../page';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import pool from '@/app/_lib/db';

jest.mock('next-auth');
jest.mock('next/navigation');
jest.mock('@/app/_lib/db');
jest.mock('../FormCadastroPet', () => {
  return function MockFormCadastroPet({ donoId }) {
    return <div data-testid="form-cadastro-pet">Form Mock - DonoId: {donoId}</div>;
  };
});

describe('CadastroPage', () => {
  let mockClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockClient = {
      query: jest.fn(),
      release: jest.fn(),
    };
    
    pool.connect.mockResolvedValue(mockClient);
  });

  // ============================================
  // TESTE 1: Redireciona quando não há sessão
  // ============================================
  test('redireciona para /login quando não houver sessão', async () => {
    getServerSession.mockResolvedValue(null);

    await CadastroPage();

    expect(redirect).toHaveBeenCalledWith('/login');
  });

  // ============================================
  // TESTE 2: Renderiza com sessão válida
  // ============================================
  test('permite acesso quando houver sessão válida', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ 
        don_id: 1, 
        don_nome: 'João Silva',
        don_email: 'teste@email.com',
        don_contato: '11999999999',
        don_cpf: '12345678900'
      }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();

    expect(redirect).not.toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  // ============================================
  // TESTE 3: Busca dados do dono no banco
  // ============================================
  test('busca dados do dono pelo email da sessão', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ 
        don_id: 1, 
        don_nome: 'João Silva',
        don_email: 'teste@email.com',
        don_contato: '11999999999',
        don_cpf: '12345678900'
      }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    await CadastroPage();

    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT don_id, don_nome'),
      ['teste@email.com']
    );
  });

  // ============================================
  // TESTE 4: Mostra erro quando dono não existe
  // ============================================
  test('exibe mensagem de erro quando dono não for encontrado', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).toContain('Erro: Usuário não encontrado no sistema');
  });

  // ============================================
  // TESTE 5: Exibe informações do dono
  // ============================================
  test('exibe informações do dono quando encontrado', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'maria@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{
        don_id: 1,
        don_nome: 'Maria Santos',
        don_email: 'maria@email.com',
        don_contato: '11987654321',
        don_cpf: '98765432100'
      }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).toContain('Maria Santos');
    expect(container.textContent).toContain('11987654321');
  });

  // ============================================
  // TESTE 6: Exibe complemento da residência
  // ============================================
  test('exibe complemento da residência quando disponível', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({
      rows: [{ res_complemento: 'Apto 202, Bloco B' }]
    });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).toContain('Apto 202, Bloco B');
  });

  // ============================================
  // TESTE 7: Mostra "Não informado" sem residência
  // ============================================
  test('exibe "Não informado" quando não houver residência', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).toContain('Não informado');
  });

  // ============================================
  // TESTE 8: Renderiza formulário com donoId
  // ============================================
  test('renderiza FormCadastroPet com donoId correto', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 42, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    render(result);

    const form = screen.getByTestId('form-cadastro-pet');
    expect(form).toBeInTheDocument();
    expect(form.textContent).toContain('DonoId: 42');
  });

  // ============================================
  // TESTE 9: Não mostra seção de pets vazia
  // ============================================
  test('não renderiza seção de pets quando lista estiver vazia', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).not.toContain('Pets Cadastrados');
  });

  // ============================================
  // TESTE 10: Renderiza lista de pets
  // ============================================
  test('renderiza lista de pets quando houver pets cadastrados', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({
      rows: [
        {
          pet_id: 1,
          pet_nome: 'Rex',
          pet_tipo: 'Cachorro',
          pet_raca: 'Labrador',
          pet_foto: '/foto-rex.jpg'
        },
        {
          pet_id: 2,
          pet_nome: 'Mia',
          pet_tipo: 'Gato',
          pet_raca: 'Siamês',
          pet_foto: null
        }
      ]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    expect(container.textContent).toContain('Pets Cadastrados');
    expect(container.textContent).toContain('Rex');
    expect(container.textContent).toContain('Cachorro - Labrador');
    expect(container.textContent).toContain('Mia');
    expect(container.textContent).toContain('Gato - Siamês');
  });

  // ============================================
  // TESTE 11: Renderiza foto do pet
  // ============================================
  test('renderiza foto do pet quando disponível', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({
      rows: [{
        pet_id: 1,
        pet_nome: 'Rex',
        pet_tipo: 'Cachorro',
        pet_raca: 'Labrador',
        pet_foto: '/fotos/rex.jpg'
      }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    const img = container.querySelector('img.pet-foto');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/fotos/rex.jpg');
    expect(img.getAttribute('alt')).toBe('Rex');
  });

  // ============================================
  // TESTE 12: Não renderiza foto quando ausente
  // ============================================
  test('não renderiza foto quando pet não tiver foto', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({
      rows: [{
        pet_id: 1,
        pet_nome: 'Mia',
        pet_tipo: 'Gato',
        pet_raca: 'Persa',
        pet_foto: null
      }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    const result = await CadastroPage();
    const { container } = render(result);

    const img = container.querySelector('img.pet-foto');
    expect(img).toBeFalsy();
  });

  // ============================================
  // TESTE 13: Libera conexão do banco
  // ============================================
  test('libera conexão do banco mesmo em caso de erro', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockRejectedValueOnce(new Error('Erro no banco'));

    await expect(CadastroPage()).rejects.toThrow();
    expect(mockClient.release).toHaveBeenCalled();
  });

  // ============================================
  // TESTE 14: Busca pets ordenados DESC
  // ============================================
  test('busca pets ordenados por pet_id DESC', async () => {
    getServerSession.mockResolvedValue({
      user: { email: 'teste@email.com' }
    });

    mockClient.query.mockResolvedValueOnce({
      rows: [{ don_id: 1, don_nome: 'João', don_email: 'teste@email.com' }]
    });
    mockClient.query.mockResolvedValueOnce({ rows: [] });
    mockClient.query.mockResolvedValueOnce({ rows: [] });

    await CadastroPage();

    expect(mockClient.query).toHaveBeenCalledWith(
      expect.stringContaining('ORDER BY pet_id DESC'),
      [1]
    );
  });
});
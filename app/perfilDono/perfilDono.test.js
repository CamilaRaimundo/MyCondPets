/**
 * app/perfilDono/perfilDono.test.js
 */
import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "./page";

// ---------------------------
// MOCKS
// ---------------------------

// Mock do next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Importa DEPOIS do mock
const { getServerSession } = require("next-auth");

// Mock do authOptions
jest.mock("../api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

// Mock do redirect
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock do componente PetsList
jest.mock("./PetsList", () => ({
  PetsList: (props) => <div data-testid="pets-list-mock">{JSON.stringify(props)}</div>,
}));

// Mock da conexão com banco
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock("../_lib/db", () => ({
  __esModule: true,
  default: {
    connect: jest.fn(() => Promise.resolve(mockClient)),
  },
}));

// ---------------------------
// TESTES
// ---------------------------

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset do mockClient.query para cada teste
    mockClient.query.mockReset();
    mockClient.release.mockReset();
  });

  test("redireciona para /login quando não houver sessão", async () => {
    const { redirect } = require("next/navigation");
    getServerSession.mockResolvedValueOnce(null);

    await Home();

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  test("renderiza dados do dono e pets corretamente", async () => {
    // Simula sessão logada
    getServerSession.mockResolvedValue({
      user: { email: "teste@teste.com" },
    });

    // Simula retorno das queries SQL
    mockClient.query
      // 1ª chamada -> dono
      .mockResolvedValueOnce({
        rows: [
          {
            don_id: 1,
            don_cpf: "123",
            don_nome: "João",
            don_email: "teste@teste.com",
            don_contato: "9999-9999",
          },
        ],
      })
      // 2ª chamada -> pets
      .mockResolvedValueOnce({
        rows: [
          { pet_nome: "Rex", pet_tipo: "Cachorro" },
          { pet_nome: "Mimi", pet_tipo: "Gato" },
        ],
      })
      // 3ª chamada -> residência
      .mockResolvedValueOnce({
        rows: [{ res_complemento: "Apt 21B" }],
      });

    // Executa componente (Server Component)
    const ui = await Home();

    // Renderiza o JSX retornado
    render(ui);

    // Verifica campos
    expect(screen.getByDisplayValue("João")).toBeInTheDocument();
    expect(screen.getByDisplayValue("teste@teste.com")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Apt 21B")).toBeInTheDocument();
    expect(screen.getByDisplayValue("9999-9999")).toBeInTheDocument();

    // Verifica renderização da lista mockada
    expect(screen.getByTestId("pets-list-mock")).toBeInTheDocument();
  });

  test("mostra 'Dono não encontrado' se query não retornar dono", async () => {
    getServerSession.mockResolvedValue({
      user: { email: "teste@teste.com" },
    });

    // primeira query (dono) retorna vazio
    mockClient.query.mockResolvedValueOnce({
      rows: [],
    });

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Dono não encontrado")).toBeInTheDocument();
  });

  test("exibe mensagem de erro quando não encontra dados do perfil", async () => {
    getServerSession.mockResolvedValue({
      user: { email: "inexistente@teste.com" },
    });

    // Query retorna vazio
    mockClient.query.mockResolvedValueOnce({
      rows: [],
    });

    const ui = await Home();
    render(ui);

    expect(screen.getByText("Não foi possível carregar os dados do perfil.")).toBeInTheDocument();
  });
});
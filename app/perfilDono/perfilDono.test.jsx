/**
 * app/perfilDono/perfilDono.test.jsx
 */

import React from "react"; // garante que React exista no ambiente do teste (cautela)
import { render, screen } from "@testing-library/react";

// importa o Home relativo à pasta app/perfilDono -> ../page
import Home from "./page"; 

// ---------------------------
// MOCKS
// ---------------------------

// Mock do getServerSession (o seu código importa { getServerSession } from "next-auth")
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

// Mock do authOptions (caso seja importado pelo seu Home)
jest.mock("../api/auth/[...nextauth]/route", () => ({
  authOptions: {},
}));

// Mock do redirect (next/navigation)
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

// Mock do componente PetsList — caminho RELATIVO (está em app/perfilDono/PetsList.jsx)
jest.mock("./PetsList", () => ({
  PetsList: (props) => <div data-testid="pets-list-mock">{JSON.stringify(props)}</div>,
}));

// Mock da conexão com banco (app/_lib/db)
const mockClient = {
  query: jest.fn(),
  release: jest.fn(),
};

jest.mock("../_lib/db", () => ({
  __esModule: true,
  default: {
    connect: jest.fn(() => mockClient),
  },
}));

// ---------------------------
// TESTES
// ---------------------------

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza dados do dono e pets corretamente", async () => {
    const { getServerSession } = require("next-auth");

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

    // Executa componente (Server Component) — Home é async
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

  test("redireciona se não estiver logado", async () => {
    const { getServerSession } = require("next-auth");
    const { redirect } = require("next/navigation");

    getServerSession.mockResolvedValue(null);

    await Home(); // execução apenas para disparar redirect

    expect(redirect).toHaveBeenCalledWith("/login");
  });

  test("mostra 'Dono não encontrado' se query não retornar dono", async () => {
    const { getServerSession } = require("next-auth");

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
});

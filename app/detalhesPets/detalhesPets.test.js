
/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DetalhesPets from "./page";
import "@testing-library/jest-dom";

const mockPets = [
  {
    nome: "Totó",
    raca: "cachorro",
    idade: "3 anos",
    cor: "caramelo",
    dono: "Fulano",
    endereco: "Rua A",
    telefone: "1111",
    imagem: "img1.jpg",
  },
  {
    nome: "Mel",
    raca: "gato",
    idade: "2 anos",
    cor: "preto",
    dono: "Maria",
    endereco: "Rua B",
    telefone: "2222",
    imagem: "img2.jpg",
  },
];

// Mock global fetch
global.fetch = jest.fn();

describe("Página DetalhesPets", () => {
  
  beforeEach(() => {
    fetch.mockClear();
  });

  test("exibe mensagem de carregamento antes de buscar pets", async () => {
    fetch.mockResolvedValue({
      json: async () => mockPets,
    });

    render(<DetalhesPets />);

    expect(screen.getByText("Carregando Pets...")).toBeInTheDocument();

    await screen.findByText("Totó");
  });

  test("carrega e exibe o primeiro pet da lista", async () => {
    fetch.mockResolvedValue({
      json: async () => mockPets,
    });

    render(<DetalhesPets />);

    expect(await screen.findByText("Totó")).toBeInTheDocument();
    expect(screen.getByText("Raça: cachorro")).toBeInTheDocument();
  });

  test("exibe lista filtrada ao digitar na barra de pesquisa", async () => {
    fetch.mockResolvedValue({
      json: async () => mockPets,
    });

    render(<DetalhesPets />);

    await waitFor(() => screen.getByText("Totó"));

    const input = screen.getByPlaceholderText("Pesquisar pet...");

    fireEvent.change(input, { target: { value: "mel" } });

    expect(screen.getByText("Mel, Rua B")).toBeInTheDocument();
    expect(screen.queryByText("Totó, Rua A")).not.toBeInTheDocument();
  });

  test("ao clicar em um pet, troca o pet selecionado", async () => {
    fetch.mockResolvedValue({
      json: async () => mockPets,
    });

    render(<DetalhesPets />);

    await screen.findByText("Totó");

    const clickMel = screen.getByText("Mel, Rua B");
    fireEvent.click(clickMel);

    expect(screen.getByText("Mel")).toBeInTheDocument();
    expect(screen.getByText("Raça: gato")).toBeInTheDocument();
  });

  test("limpa pesquisa ao selecionar um pet", async () => {
    fetch.mockResolvedValue({
      json: async () => mockPets,
    });

    render(<DetalhesPets />);

    await screen.findByText("Totó");

    const input = screen.getByPlaceholderText("Pesquisar pet...");
    fireEvent.change(input, { target: { value: "mel" } });

    fireEvent.click(screen.getByText("Mel, Rua B"));

    expect(input.value).toBe(""); // Pesquisa limpa após selecionar
  });

  test("exibe erro no console caso a requisição falhe", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    fetch.mockRejectedValue(new Error("Erro no servidor"));

    render(<DetalhesPets />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

});

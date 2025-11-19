import { buscaOuCriaDono } from "./buscaOuCriaDono";

// Mock do pool de conexão
jest.mock("../db", () => ({
  query: jest.fn(),
}));

// Importar o mock para usar nos testes
import pool from "../db";

describe("buscaOuCriaDono", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deve ser uma função", () => {
    expect(typeof buscaOuCriaDono).toBe("function");
  });

  test("deve retornar um objeto com propriedade dono quando usuário existe", async () => {
    // Mock do retorno da query para usuário existente
    pool.query.mockResolvedValue({
      rows: [
        { don_id: 1, don_email: "teste@email.com", don_nome: "Teste Usuario" },
      ],
    });

    const result = await buscaOuCriaDono("teste@email.com", "Teste Usuario");

    expect(result).toHaveProperty("dono");
    expect(result).toHaveProperty("isNew");
    expect(result.isNew).toBe(false);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT * FROM dono WHERE don_email = $1",
      ["teste@email.com"]
    );
  });

  test("deve lançar erro se email não for fornecido", async () => {
    await expect(buscaOuCriaDono(null, "Nome")).rejects.toThrow(
      "Email é obrigatório."
    );
  });
});

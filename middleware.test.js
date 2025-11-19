import middleware from "./middleware"; // Importa o default export do seu arquivo

// Mock do next-auth/middleware para interceptar a configuração
jest.mock("next-auth/middleware", () => ({
  withAuth: jest.fn((config) => {
    // Retorna a própria configuração para que possamos inspecioná-la no teste
    return config;
  }),
}));

describe("Middleware de Autenticação", () => {
  // O 'middleware' importado agora é o objeto de configuração retornado pelo mock
  const authConfig = middleware;

  test("deve autorizar o acesso se o token existir", async () => {
    const authorized = authConfig.callbacks.authorized;
    
    // Simula um token válido
    const result = await authorized({ token: { name: "Usuario", email: "teste@teste.com" } });
    
    expect(result).toBe(true);
  });

  test("deve negar o acesso se o token for nulo", async () => {
    const authorized = authConfig.callbacks.authorized;
    
    // Simula ausência de token
    const result = await authorized({ token: null });
    
    expect(result).toBe(false);
  });

  test("deve negar o acesso se o token for indefinido", async () => {
    const authorized = authConfig.callbacks.authorized;
    
    const result = await authorized({ token: undefined });
    
    expect(result).toBe(false);
  });
});
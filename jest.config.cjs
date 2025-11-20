const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Aponta para a raiz para carregar next.config.mjs e .env
  dir: "./",
});

// Configurações personalizadas
const config = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // Mock para módulos problemáticos e mapeamento de aliases
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^jose$": "<rootDir>/__mocks__/jose.js",
    "^@panva/hkdf$": "<rootDir>/__mocks__/@panva/hkdf.js",
    "^openid-client$": "identity-obj-proxy",
    "^uuid$": "identity-obj-proxy",
  },

  // Limpa mocks automaticamente
  clearMocks: true,

  // IMPORTANTE: Isso diz ao Jest para processar (transpilar) essas libs específicas
  // dentro de node_modules, resolvendo o erro "Unexpected token 'export'"
  transformIgnorePatterns: [
    "/node_modules/(?!(jose|openid-client|uuid|next-auth|@panva/hkdf|@auth)/)/",
  ],

  // Configuração adicional para resolver problemas com módulos ES
  extensionsToTreatAsEsm: [".jsx", ".ts", ".tsx"],
};

module.exports = createJestConfig(config);

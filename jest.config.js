const nextJest = require("next/jest");


const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    "\\.(css|scss|sass)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },

  // Garante que o Jest aceite ESM e JSX sem Babel
  transform: {},

};

module.exports = createJestConfig(customJestConfig);

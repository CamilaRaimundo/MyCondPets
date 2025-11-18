module.exports = {
  testEnvironment: "jsdom",

  moduleNameMapper: {
    "\\.(css|scss|sass|less)$": "identity-obj-proxy",
    "^@/(.*)$": "<rootDir>/$1"
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

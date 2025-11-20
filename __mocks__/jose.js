// Mock para o módulo jose
export const jwtVerify = jest.fn();
export const SignJWT = jest.fn();
export const importSPKI = jest.fn();
export const importPKCS8 = jest.fn();
export const generateKeyPair = jest.fn();

export default {
  jwtVerify,
  SignJWT,
  importSPKI,
  importPKCS8,
  generateKeyPair,
};

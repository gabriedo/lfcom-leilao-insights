// Configurações globais para os testes
import '@testing-library/jest-dom';

// Mock do fetch para testes
global.fetch = jest.fn();

// Limpar todos os mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
}); 
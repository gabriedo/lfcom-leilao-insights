import { config } from 'dotenv';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Carrega variáveis de ambiente do arquivo .env
config();

// Configura timeout global para testes
jest.setTimeout(30000);

// Suprime logs durante os testes
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
};

// Limpa o DOM após cada teste
afterEach(() => {
  cleanup();
}); 
/**
 * Setup file para Jest
 * Configuración global para tests
 */

import { config } from 'dotenv';

// Cargar variables de entorno para testing
config({ path: '.env.test' });

// Configurar timeout global para tests
jest.setTimeout(10000);

// Mock global para console en tests (opcional)
global.console = {
  ...console,
  // Uncomment to suppress console.log during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

// Setup para base de datos de testing
beforeAll(async () => {
  // Aquí se puede configurar una base de datos de testing
  // Por ejemplo, usar :memory: para SQLite en tests
});

afterAll(async () => {
  // Cleanup después de todos los tests
  // Cerrar conexiones de base de datos si las hay
  await new Promise(resolve => setTimeout(resolve, 100));
});

beforeEach(() => {
  // Reset de mocks antes de cada test
  jest.clearAllMocks();
});

afterEach(() => {
  // Cleanup después de cada test
});

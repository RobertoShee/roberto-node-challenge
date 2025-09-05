import { config } from 'dotenv';
import { DataSource } from 'typeorm';
import { logger } from '../src/common/logger';
import { jest, beforeAll, afterAll, beforeEach } from '@jest/globals';

// Mock environment variables
process.env = {
  ...process.env,
  NODE_ENV: 'test',
  CORS_ORIGINS: 'http://localhost:3000',
  PORT: '4000',
  DB_TYPE: 'sqlite',
  DB_HOST: ':memory:',
  DB_PORT: '0',
  DB_USERNAME: 'test',
  DB_PASSWORD: 'test',
  DB_DATABASE: ':memory:',
  LOG_LEVEL: 'debug',
  API_PREFIX: '/api'
};

// Mock del logger
jest.mock('../src/common/logger', () => {
  const mockLogger = {
    info: jest.fn().mockImplementation(() => {}),
    error: jest.fn().mockImplementation(() => {}),
    warn: jest.fn().mockImplementation(() => {}),
    debug: jest.fn().mockImplementation(() => {}),
    database: jest.fn().mockImplementation(() => {}),
    httpRequest: jest.fn().mockImplementation(() => {}),
    websocket: jest.fn().mockImplementation(() => {})
  };

  const Logger = {
    getInstance: jest.fn().mockReturnValue(mockLogger)
  };

  return {
    logger: mockLogger,
    Logger
  };
});

// Mock de TypeORM DataSource
jest.mock('../src/config/data-source', () => {
  const mockMethods = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  mockMethods.find.mockResolvedValue([]);
  mockMethods.findOne.mockResolvedValue(null);
  mockMethods.findOneBy.mockResolvedValue(null);
  mockMethods.save.mockImplementation((entity: any) => Promise.resolve({ id: 1, ...entity }));
  mockMethods.delete.mockResolvedValue({ affected: 1 });
  mockMethods.createQueryBuilder.mockReturnValue({
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
  });

  const AppDataSource = {
    initialize: jest.fn().mockResolvedValue(void 0),
    destroy: jest.fn().mockResolvedValue(void 0),
    getRepository: jest.fn().mockReturnValue(mockMethods),
    options: {
      type: 'sqlite',
      database: ':memory:',
    },
  };

  return { AppDataSource };
});

// Cargar variables de entorno para testing
config({ path: '.env.test' });

// Configurar timeout global para tests
jest.setTimeout(10000);

// Setup para base de datos de testing
beforeAll(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
});

beforeEach(() => {
  jest.clearAllMocks();
});

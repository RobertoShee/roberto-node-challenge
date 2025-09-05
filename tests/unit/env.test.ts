import { loadEnv } from '../../src/config/env';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load environment variables', () => {
    expect(() => loadEnv()).not.toThrow();
  });

  it('should handle missing .env file', () => {
    // Mock fs to simulate missing file
    jest.doMock('fs', () => ({
      existsSync: jest.fn().mockReturnValue(false)
    }));
    
    expect(() => loadEnv()).not.toThrow();
  });

  it('should load development environment by default', () => {
    delete process.env.NODE_ENV;
    expect(() => loadEnv()).not.toThrow();
  });

  it('should load production environment', () => {
    process.env.NODE_ENV = 'production';
    expect(() => loadEnv()).not.toThrow();
  });

  it('should load test environment', () => {
    process.env.NODE_ENV = 'test';
    expect(() => loadEnv()).not.toThrow();
  });
});

import '../../src/config/env';

describe('Environment Configuration Module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should load environment variables without errors', () => {
    expect(() => require('../../src/config/env')).not.toThrow();
  });

  it('should handle different NODE_ENV values', () => {
    process.env.NODE_ENV = 'production';
    expect(() => require('../../src/config/env')).not.toThrow();
    
    process.env.NODE_ENV = 'development'; 
    expect(() => require('../../src/config/env')).not.toThrow();
    
    process.env.NODE_ENV = 'test';
    expect(() => require('../../src/config/env')).not.toThrow();
  });

  it('should load dotenv configuration', () => {
    // Test that the env module loads
    const envModule = require('../../src/config/env');
    expect(envModule).toBeDefined();
  });
});

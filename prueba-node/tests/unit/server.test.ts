// Mock dependencies
jest.mock('../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    httpRequest: jest.fn(),
    database: jest.fn(),
    websocket: jest.fn()
  }
}));

jest.mock('../../src/config/data-source', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
    isInitialized: true
  }
}));

jest.mock('../../src/ws/io', () => ({
  createIO: jest.fn(),
  getIO: jest.fn().mockReturnValue({
    emit: jest.fn(),
    close: jest.fn()
  })
}));

jest.mock('../../src/app', () => ({
  app: {
    listen: jest.fn((port, callback) => {
      if (callback) callback();
      return {
        close: jest.fn((cb) => cb && cb()),
        address: jest.fn(() => ({ port }))
      };
    })
  }
}));

describe('Server Configuration', () => {
  const originalExit = process.exit;
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  beforeEach(() => {
    // Mock process.exit and console methods
    process.exit = jest.fn() as any;
    console.log = jest.fn();
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
    process.exit = originalExit;
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('should load server module without errors', () => {
    expect(() => require('../../src/server')).not.toThrow();
  });

  it('should handle SIGTERM signal', () => {
    const listeners = process.listeners('SIGTERM');
    expect(listeners.length).toBeGreaterThan(0);
  });

  it('should handle SIGINT signal', () => {
    const listeners = process.listeners('SIGINT');
    expect(listeners.length).toBeGreaterThan(0);
  });

  it('should handle uncaught exceptions', () => {
    const listeners = process.listeners('uncaughtException');
    expect(listeners.length).toBeGreaterThan(0);
  });

  it('should handle unhandled rejections', () => {
    const listeners = process.listeners('unhandledRejection');
    expect(listeners.length).toBeGreaterThan(0);
  });
});

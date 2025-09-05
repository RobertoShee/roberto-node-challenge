import { logger, Logger } from '../../src/common/logger';

describe('Logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should expose a singleton instance', () => {
    const a = Logger.getInstance();
    const b = Logger.getInstance();
    expect(a).toBe(b);
    expect(logger).toBe(a);
  });

  it('should log info without throwing', () => {
    expect(() => logger.info('message', { a: 1 })).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log error with error object', () => {
    const error = new Error('Test error');
    expect(() => logger.error('Error message', error, { context: 'test' })).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log warning', () => {
    expect(() => logger.warn('Warning message', { warning: 'test' })).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log debug', () => {
    expect(() => logger.debug('Debug message', { debug: 'test' })).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log HTTP requests', () => {
    expect(() => logger.httpRequest('GET', '/test', 200, 100, 'test-agent')).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log database operations', () => {
    expect(() => logger.database('SELECT', 'tasks', 50)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log database errors', () => {
    const error = new Error('DB Error');
    expect(() => logger.database('INSERT', 'tasks', undefined, error)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should log websocket events', () => {
    expect(() => logger.websocket('connection', 'socket-123', { data: 'test' })).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should handle HTTP request with error status codes', () => {
    // 500 error
    expect(() => logger.httpRequest('POST', '/error', 500, 200)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
    
    // 400 error
    consoleSpy.mockClear();
    expect(() => logger.httpRequest('POST', '/bad', 400, 150)).not.toThrow();
    expect(consoleSpy).toHaveBeenCalled();
  });
});

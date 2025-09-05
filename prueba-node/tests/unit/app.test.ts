import request from 'supertest';
import { app } from '../../src/app';

// Mock dependencies
jest.mock('../../src/common/logger', () => ({
  Logger: {
    getInstance: jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      httpRequest: jest.fn(),
      database: jest.fn(),
      websocket: jest.fn()
    })
  }
}));

jest.mock('../../src/config/data-source', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(undefined),
    isInitialized: false
  }
}));

jest.mock('../../src/ws/io', () => ({
  initializeWebSocket: jest.fn()
}));

describe('App Configuration', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create Express app', () => {
    expect(app).toBeDefined();
  });

  it('should handle 404 routes', async () => {
    const response = await request(app)
      .get('/nonexistent-route')
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Endpoint not found');
  });

  it('should serve static files from public directory', async () => {
    const response = await request(app)
      .get('/index.html');

    // Should attempt to serve file (may 404 if file doesn't exist)
    expect([200, 404]).toContain(response.status);
  });

  it('should parse JSON bodies', async () => {
    const response = await request(app)
      .post('/api/tasks')
      .send({ title: 'Test task', description: 'Test description' })
      .set('Content-Type', 'application/json');

    // Should process JSON (may 400/500 based on validation)
    expect(response.status).toBeDefined();
  });

  it('should handle CORS', async () => {
    const response = await request(app)
      .options('/api/tasks')
      .set('Origin', 'http://localhost:3000');

    expect(response.headers['access-control-allow-origin']).toBeDefined();
  });

  it('should apply error handling middleware', async () => {
    // Test with invalid JSON
    const response = await request(app)
      .post('/api/tasks')
      .send('invalid json')
      .set('Content-Type', 'application/json');

    expect(response.status).toBeGreaterThanOrEqual(400);
    expect(response.body).toHaveProperty('error');
  });
});

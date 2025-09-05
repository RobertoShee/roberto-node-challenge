import { AppDataSource } from '../../src/config/data-source';

jest.mock('typeorm', () => ({
  DataSource: jest.fn().mockImplementation(() => ({
    initialize: jest.fn(),
    destroy: jest.fn(),
    getRepository: jest.fn()
  }))
}));

describe('Data Source Configuration', () => {
  it('should create DataSource instance', () => {
    expect(AppDataSource).toBeDefined();
  });

  it('should have correct configuration properties', () => {
    expect(AppDataSource).toHaveProperty('options');
    expect(AppDataSource.options).toHaveProperty('type');
  });
});

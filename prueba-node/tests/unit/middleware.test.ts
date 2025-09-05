import { errorHandler, notFoundHandler, requestLogger } from '../../src/middlewares/error-handler';
import { Request, Response, NextFunction } from 'express';
import { ValidationError, NotFoundError } from '../../src/common/errors';

// Mock del logger
jest.mock('../../src/common/logger', () => ({
  logger: {
    httpRequest: jest.fn(),
    error: jest.fn()
  }
}));

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      method: 'GET',
      url: '/test',
      originalUrl: '/test',
      get: jest.fn().mockReturnValue('test-agent'),
      headers: { 'user-agent': 'test-agent' }
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      on: jest.fn(),
      statusCode: 200,
      locals: {}
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('errorHandler', () => {
    it('should handle ValidationError', () => {
      const error = new ValidationError('Validation failed', { field: ['error'] });
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        type: 'https://httpstatuses.com/400',
        status: 400,
        detail: 'Validation failed'
      }));
    });

    it('should handle NotFoundError', () => {
      const error = new NotFoundError('Task', 123);
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 404,
        detail: 'Task con ID 123 no fue encontrado'
      }));
    });

    it('should handle generic Error', () => {
      const error = new Error('Generic error');
      
      errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 500,
        title: 'Error interno del servidor'
      }));
    });
  });

  describe('notFoundHandler', () => {
    it('should return 404 for unknown routes', () => {
      notFoundHandler(mockRequest as Request, mockResponse as Response);
      
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        status: 404,
        detail: 'Ruta GET /test no encontrada'
      }));
    });
  });

  describe('requestLogger', () => {
    it('should log requests and set up response time logging', () => {
      requestLogger(mockRequest as Request, mockResponse as Response, mockNext);
      
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.on).toHaveBeenCalledWith('finish', expect.any(Function));
    });
  });
});

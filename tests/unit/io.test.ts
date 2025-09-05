import { createIO, getIO } from '../../src/ws/io';
import { Server } from 'http';

jest.mock('socket.io', () => ({
  Server: jest.fn().mockImplementation(() => ({
    on: jest.fn(),
    emit: jest.fn()
  }))
}));

jest.mock('../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}));

describe('WebSocket IO Functions', () => {
  let mockServer: Server;

  beforeEach(() => {
    mockServer = new Server();
    jest.clearAllMocks();
  });

  describe('createIO', () => {
    it('should create and return socket.io server', () => {
      const io = createIO(mockServer);
      
      expect(io).toBeDefined();
    });

    it('should setup connection event handler', () => {
      const io = createIO(mockServer);
      
      expect(io.on).toHaveBeenCalledWith('connection', expect.any(Function));
    });
  });

  describe('getIO', () => {
    it('should return null when IO is not initialized', () => {
      const io = getIO();
      
      expect(io).toBeNull();
    });

    it('should return IO instance after creation', () => {
      const createdIO = createIO(mockServer);
      const retrievedIO = getIO();
      
      expect(retrievedIO).toBe(createdIO);
    });
  });
});

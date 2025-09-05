import { emitNewTask, emitTaskUpdated, emitTaskDeleted } from '../../src/modules/tasks/task.ws';
import { getIO } from '../../src/ws/io';
import { Task } from '../../src/modules/tasks/task.entity';

jest.mock('../../src/ws/io', () => ({
  getIO: jest.fn()
}));

jest.mock('../../src/common/logger', () => ({
  logger: {
    websocket: jest.fn()
  }
}));

const mockGetIO = getIO as jest.MockedFunction<typeof getIO>;

describe('Task WebSocket Functions', () => {
  let mockIO: any;

  beforeEach(() => {
    mockIO = {
      emit: jest.fn()
    };
    mockGetIO.mockReturnValue(mockIO);
    jest.clearAllMocks();
  });

  describe('emitNewTask', () => {
    it('should emit new task event when IO is available', () => {
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: 'Test description',
        status: 'pendiente',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      emitNewTask(task);

      expect(mockGetIO).toHaveBeenCalled();
      expect(mockIO.emit).toHaveBeenCalledWith('newTask', task);
    });

    it('should handle when IO is not available', () => {
      mockGetIO.mockReturnValue(undefined as any);
      
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: 'Test description',
        status: 'pendiente',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      expect(() => emitNewTask(task)).not.toThrow();
    });
  });

  describe('emitTaskUpdated', () => {
    it('should emit task updated event', () => {
      emitTaskUpdated(1, 'completada');

      expect(mockIO.emit).toHaveBeenCalledWith('taskUpdated', { id: 1, status: 'completada' });
    });
  });

  describe('emitTaskDeleted', () => {
    it('should emit task deleted event', () => {
      const taskId = 123;

      emitTaskDeleted(taskId);

      expect(mockIO.emit).toHaveBeenCalledWith('taskDeleted', { id: taskId });
    });
  });
});

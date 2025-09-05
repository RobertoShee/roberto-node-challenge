import { getTasks, createTask, updateTask, deleteTask } from '../../src/modules/tasks/handlers/task.handlers';
import { CreateTaskDto, UpdateTaskStatusDtoClass, TaskStatusEnum } from '../../src/modules/tasks/dto';
import { TaskService } from '../../src/modules/tasks/task.service';
import { Request, Response, NextFunction } from 'express';
import { Task } from '../../src/modules/tasks/task.entity';

// Mock the task service
jest.mock('../../src/modules/tasks/task.service');

// Mock lodash decorators
jest.mock('lodash-decorators', () => ({
  debounce: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor,
  throttle: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => descriptor
}));

// Mock WebSocket emitters
jest.mock('../../src/modules/tasks/task.ws', () => ({
  emitNewTask: jest.fn(),
  emitTaskUpdated: jest.fn(),
  emitTaskDeleted: jest.fn()
}));

// Mock logger
jest.mock('../../src/common/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    httpRequest: jest.fn()
  }
}));

describe('Task Handlers', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let mockTaskService: jest.Mocked<TaskService>;

  beforeEach(() => {
    mockTaskService = {
      list: jest.fn(),
      create: jest.fn(),
      updateStatus: jest.fn(),
      remove: jest.fn(),
      findById: jest.fn()
    } as any;

    (TaskService as jest.MockedClass<typeof TaskService>).mockImplementation(() => mockTaskService);
    
    mockRequest = {
      params: {},
      body: {},
      query: {}
    };
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
    mockNext = jest.fn();
    
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return list of tasks', async () => {
      const mockTasks: Task[] = [
        { 
          id: 1, 
          titulo: 'Task 1', 
          descripcion: 'Description 1', 
          status: 'pendiente',
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        },
        { 
          id: 2, 
          titulo: 'Task 2', 
          descripcion: 'Description 2', 
          status: 'completada',
          fechaCreacion: new Date(),
          fechaActualizacion: new Date()
        }
      ];
      
      mockTaskService.list.mockResolvedValue(mockTasks);

      await getTasks(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockTaskService.list).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should call next with error on service failure', async () => {
      const error = new Error('Service error');
      mockTaskService.list.mockRejectedValue(error);

      await getTasks(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const createDto: CreateTaskDto = {
        titulo: 'New Task',
        descripcion: 'New Description'
      };
      const mockTask: Task = { 
        id: 1, 
        titulo: 'New Task',
        descripcion: 'New Description',
        status: 'pendiente',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      mockRequest.body = createDto;
      mockTaskService.create.mockResolvedValue(mockTask);

      await createTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockTaskService.create).toHaveBeenCalledWith(createDto);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should call next with error on creation failure', async () => {
      const createDto: CreateTaskDto = {
        titulo: 'New Task',
        descripcion: 'New Description'
      };
      const error = new Error('Creation failed');

      mockRequest.body = createDto;
      mockTaskService.create.mockRejectedValue(error);

      await createTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('updateTask', () => {
    it('should update task status', async () => {
      const updateDto = { status: TaskStatusEnum.COMPLETADA } as UpdateTaskStatusDtoClass;
      const mockTask: Task = { 
        id: 1, 
        titulo: 'Task', 
        status: 'completada',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      };

      mockRequest.params = { id: '1' };
      mockRequest.body = updateDto;
      mockTaskService.updateStatus.mockResolvedValue(mockTask);

      await updateTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockTaskService.updateStatus).toHaveBeenCalledWith(1, updateDto);
      expect(mockResponse.json).toHaveBeenCalledWith(mockTask);
    });

    it('should call next with error on update failure', async () => {
      const updateDto = { status: TaskStatusEnum.COMPLETADA } as UpdateTaskStatusDtoClass;
      const error = new Error('Update failed');

      mockRequest.params = { id: '1' };
      mockRequest.body = updateDto;
      mockTaskService.updateStatus.mockRejectedValue(error);

      await updateTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockRequest.params = { id: '1' };
      mockTaskService.remove.mockResolvedValue(undefined);

      await deleteTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockTaskService.remove).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(204);
      expect(mockResponse.end).toHaveBeenCalled();
    });

    it('should call next with error on deletion failure', async () => {
      const error = new Error('Deletion failed');

      mockRequest.params = { id: '1' };
      mockTaskService.remove.mockRejectedValue(error);

      await deleteTask(
        mockRequest as Request, 
        mockResponse as Response, 
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

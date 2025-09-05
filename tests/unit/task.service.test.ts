import { TaskService } from '../../src/modules/tasks/task.service';
import { Task } from '../../src/modules/tasks/task.entity';
import { AppDataSource } from '../../src/config/data-source';
import { NotFoundError } from '../../src/common/errors';

jest.mock('../../src/config/data-source', () => ({
  AppDataSource: {
    getRepository: jest.fn()
  }
}));

// Mock del logger para evitar handles abiertos
jest.mock('../../src/common/logger', () => ({
  logger: {
    database: jest.fn(),
    info: jest.fn(),
    error: jest.fn()
  }
}));

const mockRepo = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  remove: jest.fn()
};

(AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepo);

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new TaskService();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('list() should return tasks ordered by fechaCreacion DESC', async () => {
    const tasks = [{ id: 1, fechaCreacion: new Date() } as Task];
    mockRepo.find.mockResolvedValue(tasks);
    
    const result = await service.list();
    
    expect(mockRepo.find).toHaveBeenCalledWith({ order: { fechaCreacion: 'DESC' } });
    expect(result).toEqual(tasks);
  });

  it('create() should create and save a new task', async () => {
    const input = { titulo: 'Test', descripcion: 'Desc' };
    const created = { titulo: 'Test', descripcion: 'Desc' };
    const saved = { id: 1, titulo: 'Test', descripcion: 'Desc' };
    
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(saved);
    
    const result = await service.create(input);
    
    expect(mockRepo.create).toHaveBeenCalledWith({ titulo: 'Test', descripcion: 'Desc' });
    expect(mockRepo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });

  it('create() should handle undefined description as null', async () => {
    const input = { titulo: 'Test', descripcion: undefined };
    const created = { titulo: 'Test', descripcion: null };
    const saved = { id: 1, titulo: 'Test', descripcion: null };
    
    mockRepo.create.mockReturnValue(created);
    mockRepo.save.mockResolvedValue(saved);
    
    const result = await service.create(input);
    
    expect(mockRepo.create).toHaveBeenCalledWith({ titulo: 'Test', descripcion: null });
    expect(mockRepo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(saved);
  });

  it('updateStatus() should update status of an existing task', async () => {
    const existing = { id: 1, titulo: 'Test', status: 'pendiente' } as Task;
    const updated = { ...existing, status: 'completada' };
    
    mockRepo.findOneBy.mockResolvedValue(existing);
    mockRepo.save.mockResolvedValue(updated);
    
    const result = await service.updateStatus(1, 'completada');
    
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({ id: 1, status: 'completada' }));
    expect(result).toEqual(updated);
  });

  it('updateStatus() should throw NotFoundError if task not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    
    await expect(service.updateStatus(1, 'completada')).rejects.toThrow(NotFoundError);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('remove() should delete an existing task', async () => {
    const existing = { id: 1, titulo: 'Test' } as Task;
    
    mockRepo.findOneBy.mockResolvedValue(existing);
    mockRepo.remove.mockResolvedValue(undefined);
    
    await service.remove(1);
    
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(mockRepo.remove).toHaveBeenCalledWith(existing);
  });

  it('remove() should throw NotFoundError if task not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    
    await expect(service.remove(1)).rejects.toThrow(NotFoundError);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('findById() should return a task by id', async () => {
    const task = { id: 1, titulo: 'Test' } as Task;
    
    mockRepo.findOneBy.mockResolvedValue(task);
    
    const result = await service.findById(1);
    
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    expect(result).toEqual(task);
  });

  it('findById() should throw NotFoundError if not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    
    await expect(service.findById(1)).rejects.toThrow(NotFoundError);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });
});
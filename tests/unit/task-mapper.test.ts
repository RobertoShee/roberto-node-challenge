import { TaskMapper } from '../../src/modules/tasks/mappers/task.mapper';
import { Task } from '../../src/modules/tasks/task.entity';
import { CreateTaskDto, TaskStatusEnum } from '../../src/modules/tasks/dto/task.dto';

describe('TaskMapper', () => {
  describe('toResponseDto', () => {
    it('should convert Task entity to response DTO correctly', () => {
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: 'Test Description',
        status: 'pendiente',
        fechaCreacion: new Date('2025-09-03T00:00:00.000Z'),
        fechaActualizacion: new Date('2025-09-03T00:00:00.000Z')
      };

      const result = TaskMapper.toResponseDto(task);

      expect(result).toEqual({
        id: 1,
        titulo: 'Test Task',
        descripcion: 'Test Description',
        status: TaskStatusEnum.PENDIENTE,
        fechaCreacion: '2025-09-03T00:00:00.000Z',
        fechaActualizacion: '2025-09-03T00:00:00.000Z'
      });
    });

    it('should keep null description in response', () => {
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: null,
        status: 'completada',
        fechaCreacion: new Date('2025-09-03T00:00:00.000Z'),
        fechaActualizacion: new Date('2025-09-03T00:00:00.000Z')
      };

      const result = TaskMapper.toResponseDto(task);

      expect(result.descripcion).toBeNull();
      expect(result.status).toBe(TaskStatusEnum.COMPLETADA);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert CreateTaskDto to entity data correctly', () => {
      const createDto: CreateTaskDto = {
        titulo: 'New Task',
        descripcion: 'New Description'
      };

      const result = TaskMapper.fromCreateDto(createDto);

      expect(result).toEqual({
        titulo: 'New Task',
        descripcion: 'New Description'
      });
    });

    it('should set null when description is undefined', () => {
      const createDto: CreateTaskDto = {
        titulo: 'New Task'
      };

      const result = TaskMapper.fromCreateDto(createDto);

      expect(result.titulo).toBe('New Task');
      expect(result.descripcion).toBeNull();
    });
  });

  describe('mapStatusToEnum', () => {
    it('should map entity status to DTO enum correctly', () => {
      expect(TaskMapper.mapStatusToEnum('pendiente')).toBe(TaskStatusEnum.PENDIENTE);
      expect(TaskMapper.mapStatusToEnum('completada')).toBe(TaskStatusEnum.COMPLETADA);
      expect(TaskMapper.mapStatusToEnum('cancelada')).toBe(TaskStatusEnum.CANCELADA);
    });
  });

  describe('mapEnumToStatus', () => {
    it('should map DTO enum to entity status correctly', () => {
      expect(TaskMapper.mapEnumToStatus(TaskStatusEnum.PENDIENTE)).toBe('pendiente');
      expect(TaskMapper.mapEnumToStatus(TaskStatusEnum.COMPLETADA)).toBe('completada');
      expect(TaskMapper.mapEnumToStatus(TaskStatusEnum.CANCELADA)).toBe('cancelada');
    });
  });
});
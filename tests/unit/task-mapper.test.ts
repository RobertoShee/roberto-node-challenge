/**
 * Test unitario para TaskMapper
 */

import { TaskMapper } from '../../src/modules/tasks/mappers/task.mapper';
import { Task } from '../../src/modules/tasks/task.entity';
import { CreateTaskDto, TaskStatusEnum } from '../../src/modules/tasks/dto/task.dto';

describe('TaskMapper', () => {
  describe('toResponseDto', () => {
    it('should convert Task entity to response DTO correctly', () => {
      // Arrange
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: 'Test Description',
        status: 'pendiente',
        fechaCreacion: new Date('2025-09-03T00:00:00.000Z'),
        fechaActualizacion: new Date('2025-09-03T00:00:00.000Z')
      };

      // Act
      const result = TaskMapper.toResponseDto(task);

      // Assert
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
      // Arrange
      const task: Task = {
        id: 1,
        titulo: 'Test Task',
        descripcion: null,
        status: 'completada',
        fechaCreacion: new Date('2025-09-03T00:00:00.000Z'),
        fechaActualizacion: new Date('2025-09-03T00:00:00.000Z')
      };

      // Act
      const result = TaskMapper.toResponseDto(task);

      // Assert
      expect(result.descripcion).toBeNull();
      expect(result.status).toBe(TaskStatusEnum.COMPLETADA);
    });
  });

  describe('fromCreateDto', () => {
    it('should convert CreateTaskDto to entity data correctly', () => {
      // Arrange
      const createDto: CreateTaskDto = {
        titulo: 'New Task',
        descripcion: 'New Description'
      };

      // Act
      const result = TaskMapper.fromCreateDto(createDto);

      // Assert
      expect(result).toEqual({
        titulo: 'New Task',
        descripcion: 'New Description'
      });
    });

    it('should set null when description is undefined', () => {
      // Arrange
      const createDto: CreateTaskDto = {
        titulo: 'New Task'
      };

      // Act
      const result = TaskMapper.fromCreateDto(createDto);

      // Assert
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
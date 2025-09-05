import { validate } from 'class-validator';
import { CreateTaskDto, TaskStatusEnum, UpdateTaskStatusDtoClass } from '../../src/modules/tasks/dto/task.dto';

describe('Task DTOs', () => {
  describe('CreateTaskDto', () => {
    it('should validate valid task data', async () => {
      const dto = new CreateTaskDto();
      dto.titulo = 'Valid Title';
      dto.descripcion = 'Valid description';
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject empty title', async () => {
      const dto = new CreateTaskDto();
      dto.titulo = '';
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('titulo');
    });

    it('should reject title too long', async () => {
      const dto = new CreateTaskDto();
      dto.titulo = 'a'.repeat(101); // Over 100 chars
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('titulo');
    });
  });

  describe('UpdateTaskStatusDtoClass', () => {
    it('should validate valid status', async () => {
      const dto = new UpdateTaskStatusDtoClass();
      dto.status = TaskStatusEnum.COMPLETADA;
      
      const errors = await validate(dto);
      expect(errors).toHaveLength(0);
    });

    it('should reject invalid status', async () => {
      const dto = new UpdateTaskStatusDtoClass();
      (dto as any).status = 'invalid_status';
      
      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('status');
    });
  });
});

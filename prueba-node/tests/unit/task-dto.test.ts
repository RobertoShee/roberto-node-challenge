// Test DTO classes and validation
describe('Task DTOs', () => {
  it('should load task DTO module without errors', () => {
    expect(() => require('../../src/modules/tasks/dto')).not.toThrow();
  });

  it('should export CreateTaskDto', () => {
    const dtoModule = require('../../src/modules/tasks/dto');
    expect(dtoModule.CreateTaskDto).toBeDefined();
    expect(typeof dtoModule.CreateTaskDto).toBe('function');
  });

  it('should export UpdateTaskStatusDtoClass', () => {
    const dtoModule = require('../../src/modules/tasks/dto');
    expect(dtoModule.UpdateTaskStatusDtoClass).toBeDefined();
    expect(typeof dtoModule.UpdateTaskStatusDtoClass).toBe('function');
  });

  it('should export TaskParamsDto', () => {
    const dtoModule = require('../../src/modules/tasks/dto');
    expect(dtoModule.TaskParamsDto).toBeDefined();
    expect(typeof dtoModule.TaskParamsDto).toBe('function');
  });

  it('should create CreateTaskDto instance', () => {
    const { CreateTaskDto } = require('../../src/modules/tasks/dto');
    const dto = new CreateTaskDto();
    expect(dto).toBeInstanceOf(CreateTaskDto);
  });

  it('should create UpdateTaskStatusDtoClass instance', () => {
    const { UpdateTaskStatusDtoClass } = require('../../src/modules/tasks/dto');
    const dto = new UpdateTaskStatusDtoClass();
    expect(dto).toBeInstanceOf(UpdateTaskStatusDtoClass);
  });

  it('should create TaskParamsDto instance', () => {
    const { TaskParamsDto } = require('../../src/modules/tasks/dto');
    const dto = new TaskParamsDto();
    expect(dto).toBeInstanceOf(TaskParamsDto);
  });
});

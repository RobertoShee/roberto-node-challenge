// Import and test the task entity module
describe('Task Entity', () => {
  it('should load task entity module without errors', () => {
    expect(() => require('../../src/modules/tasks/task.entity')).not.toThrow();
  });

  it('should export Task class', () => {
    const taskEntity = require('../../src/modules/tasks/task.entity');
    expect(taskEntity.Task).toBeDefined();
    expect(typeof taskEntity.Task).toBe('function');
  });

  it('should create Task instance', () => {
    const { Task } = require('../../src/modules/tasks/task.entity');
    const task = new Task();
    expect(task).toBeInstanceOf(Task);
  });
});

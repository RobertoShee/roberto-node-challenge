describe('Task Routes', () => {
  it('should load task routes module without errors', () => {
    expect(() => require('../../src/modules/tasks/routes')).not.toThrow();
  });

  it('should export router', () => {
    const routesModule = require('../../src/modules/tasks/routes');
    expect(routesModule.taskRouter).toBeDefined();
  });

  it('should load task controllers module', () => {
    expect(() => require('../../src/modules/tasks/controllers')).not.toThrow();
  });

  it('should export task router from controllers', () => {
    const controllersModule = require('../../src/modules/tasks/controllers');
    expect(controllersModule.taskRouter).toBeDefined();
  });
});

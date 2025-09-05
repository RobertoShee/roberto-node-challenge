import { Router } from 'express';
import { validateDto } from '../../../middlewares/validate-dto';
import { CreateTaskDto, UpdateTaskStatusDtoClass, TaskParamsDto } from '../dto';
import { getTasks, createTask, updateTask, deleteTask } from '../handlers/task.handlers';

export const taskRouter = Router();

// Listar tareas
taskRouter.get('/', getTasks);

// Crear tarea
taskRouter.post(
  '/',
  validateDto(CreateTaskDto, 'body'),
  createTask
);

// Actualizar estado de tarea
taskRouter.put(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  validateDto(UpdateTaskStatusDtoClass, 'body'),
  updateTask
);

// Eliminar tarea
taskRouter.delete(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  deleteTask
);

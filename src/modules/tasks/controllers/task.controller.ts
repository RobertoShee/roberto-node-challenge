import { Router } from 'express';
import { validateDto } from '../../../middlewares/validate-dto';
import { CreateTaskDto, UpdateTaskStatusDtoClass, TaskParamsDto } from '../dto';
import { getTasks, createTask, updateTask, deleteTask } from '../handlers/task.handlers';

export const taskRouter = Router();

// GET /tasks - Obtener todas las tareas
taskRouter.get('/', getTasks);

// POST /tasks - Crear una nueva tarea
taskRouter.post(
  '/',
  validateDto(CreateTaskDto, 'body'),
  createTask
);

// PUT /tasks/:id - Actualizar el estado de una tarea
taskRouter.put(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  validateDto(UpdateTaskStatusDtoClass, 'body'),
  updateTask
);

// DELETE /tasks/:id - Eliminar una tarea
taskRouter.delete(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  deleteTask
);

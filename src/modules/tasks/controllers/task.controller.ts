import { Router } from 'express';
import { validateDto } from '../../../middlewares/validate-dto';
import { CreateTaskDto, UpdateTaskStatusDtoClass, TaskParamsDto } from '../dto';
import { getTasks, createTask, updateTask, deleteTask } from '../handlers/task.handlers';

export const taskRouter = Router();

taskRouter.get('/', getTasks);

taskRouter.post(
  '/',
  validateDto(CreateTaskDto, 'body'),
  createTask
);

taskRouter.put(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  validateDto(UpdateTaskStatusDtoClass, 'body'),
  updateTask
);

taskRouter.delete(
  '/:id',
  validateDto(TaskParamsDto, 'params'),
  deleteTask
);

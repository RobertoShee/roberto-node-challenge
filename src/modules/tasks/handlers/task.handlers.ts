import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { debounce, throttle } from 'lodash-decorators';
import { TaskService } from '../task.service';
import { emitNewTask, emitTaskUpdated, emitTaskDeleted } from '../task.ws';
import { TaskMapper } from '../mappers';
import { CreateTaskDto, UpdateTaskStatusDtoClass, TaskParamsDto } from '../dto/task.dto';
import { logger } from '../../../common/logger';

class TaskHandlers {
  private service = new TaskService();

  async getTasks(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.debug('Obteniendo lista de tareas');
      
      const tasks = await this.service.list();
      const taskDtos = TaskMapper.toListItemDtoArray(tasks);
      
      logger.info(`Lista de tareas obtenida: ${tasks.length} tareas`);
      res.json(taskDtos);
    } catch (error) { 
      next(error); 
    }
  }

  @throttle(1000)
  async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createDto: CreateTaskDto = req.body;
      logger.debug('Creando nueva tarea', { titulo: createDto.titulo });
      
      const taskData = TaskMapper.fromCreateDto(createDto);
      const created = await this.service.create(taskData);
      
      const responseDto = TaskMapper.toResponseDto(created);
      
      emitNewTask(created);
      
      logger.info(`Tarea creada exitosamente: ${created.titulo}`, { 
        taskId: created.id 
      });
      
      res.status(StatusCodes.CREATED).json(responseDto);
    } catch (error) { 
      next(error); 
    }
  }

  @debounce(500)
  async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: TaskParamsDto = req.params as any;
      const updateDto: UpdateTaskStatusDtoClass = req.body;
      
      logger.debug('Actualizando tarea', { 
        taskId: params.id, 
        newStatus: updateDto.status 
      });
      
      const entityStatus = TaskMapper.mapEnumToStatus(updateDto.status);
      const updated = await this.service.updateStatus(params.id, entityStatus);
      
      const responseDto = TaskMapper.toResponseDto(updated);
      
      emitTaskUpdated(params.id, updated.status);
      
      logger.info(`Tarea actualizada exitosamente`, { 
        taskId: params.id, 
        newStatus: updated.status 
      });
      
      res.json(responseDto);
    } catch (error) { 
      next(error); 
    }
  }

  async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const params: TaskParamsDto = req.params as any;
      
      logger.debug('Eliminando tarea', { taskId: params.id });
      
      await this.service.remove(params.id);
      
      emitTaskDeleted(params.id);
      
      logger.info(`Tarea eliminada exitosamente`, { taskId: params.id });
      
      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) { 
      next(error); 
    }
  }
}

const taskHandlers = new TaskHandlers();

export const getTasks = taskHandlers.getTasks.bind(taskHandlers);
export const createTask = taskHandlers.createTask.bind(taskHandlers);
export const updateTask = taskHandlers.updateTask.bind(taskHandlers);
export const deleteTask = taskHandlers.deleteTask.bind(taskHandlers);

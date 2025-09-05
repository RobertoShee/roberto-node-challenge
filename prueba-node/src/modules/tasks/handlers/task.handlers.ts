import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { debounce, throttle } from "lodash-decorators";
import { TaskService } from "../task.service";
import { emitNewTask, emitTaskDeleted, emitTaskUpdated } from "../task.ws";
import { TaskMapper } from "../mappers";
import {
  CreateTaskDto,
  TaskParamsDto,
  UpdateTaskStatusDtoClass,
} from "../dto/task.dto";
import { logger } from "../../../common/logger";

// Handlers para peticiones HTTP de tareas
class TaskHandlers {
  private service = new TaskService();

  async getTasks(
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      logger.debug("Obteniendo lista de tareas");

      const tasks = await this.service.list();

      const taskDtos = TaskMapper.toListItemDtoArray(tasks);

      logger.info(`Lista de tareas obtenida: ${tasks.length} tareas`);
      res.json(taskDtos);
    } catch (error) {
      next(error);
    }
  }

  // Crea una nueva tarea
  @throttle(1000)
  async createTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const createDto: CreateTaskDto = req.body;
      logger.debug("Creando nueva tarea", { titulo: createDto.titulo });

      const taskData = TaskMapper.fromCreateDto(createDto);
      const created = await this.service.create(taskData);

      const responseDto = TaskMapper.toResponseDto(created);

      // Emitir evento WebSocket
      emitNewTask(created);

      logger.info(`Tarea creada exitosamente: ${created.titulo}`, {
        taskId: created.id,
      });

      res.status(StatusCodes.CREATED).json(responseDto);
    } catch (error) {
      next(error);
    }
  }

  // Actualiza el estado de una tarea
  @debounce(500)
  async updateTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params: TaskParamsDto = req.params as any;
      const updateDto: UpdateTaskStatusDtoClass = req.body;

      logger.debug("Actualizando tarea", {
        taskId: params.id,
        newStatus: updateDto.status,
      });

      const entityStatus = TaskMapper.mapEnumToStatus(updateDto.status);
      const updated = await this.service.updateStatus(params.id, entityStatus);

      const responseDto = TaskMapper.toResponseDto(updated);

      // Emitir evento WebSocket
      emitTaskUpdated(params.id, updated.status);

      logger.info(`Tarea actualizada exitosamente`, {
        taskId: params.id,
        newStatus: updated.status,
      });

      res.json(responseDto);
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const params: TaskParamsDto = req.params as any;

      logger.debug("Eliminando tarea", { taskId: params.id });

      await this.service.remove(params.id);

      // Emitir evento WebSocket
      emitTaskDeleted(params.id);

      logger.info(`Tarea eliminada exitosamente`, { taskId: params.id });

      res.status(StatusCodes.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  }
}

// Exportar handlers
const taskHandlers = new TaskHandlers();

export const getTasks = taskHandlers.getTasks.bind(taskHandlers);
export const createTask = taskHandlers.createTask.bind(taskHandlers);
export const updateTask = taskHandlers.updateTask.bind(taskHandlers);
export const deleteTask = taskHandlers.deleteTask.bind(taskHandlers);

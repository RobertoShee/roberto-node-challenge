import { plainToClass } from 'class-transformer';
import { Task, TaskStatus } from '../task.entity';
import { 
  TaskBaseDto, 
  CreateTaskDto, 
  TaskStatusEnum,
  TaskListItemDtoClass,
  TaskResponseDto
} from '../dto/task.dto';

/**
 * Mappers para convertir entre entidades de BD y DTOs
 * Esto asegura que nunca exponemos la estructura interna de la BD
 */
export class TaskMapper {
  /**
   * Convierte una entidad Task de BD a DTO de respuesta pública
   */
  static toResponseDto(task: Task): TaskBaseDto {
    return {
      id: task.id,
      titulo: task.titulo,
      descripcion: task.descripcion,
      status: this.mapStatusToEnum(task.status),
      fechaCreacion: task.fechaCreacion.toISOString(),
      fechaActualizacion: task.fechaActualizacion.toISOString()
    };
  }

  /**
   * Convierte una entidad Task a DTO para listados (sin descripción)
   */
  static toListItemDto(task: Task): TaskListItemDtoClass {
    return plainToClass(TaskListItemDtoClass, {
      id: task.id,
      titulo: task.titulo,
      status: this.mapStatusToEnum(task.status),
      fechaCreacion: task.fechaCreacion.toISOString(),
      fechaActualizacion: task.fechaActualizacion.toISOString()
    });
  }

  /**
   * Convierte un array de entidades a DTOs de respuesta
   */
  static toResponseDtoArray(tasks: Task[]): TaskBaseDto[] {
    return tasks.map(task => this.toResponseDto(task));
  }

  /**
   * Convierte un array de entidades a DTOs para listados
   */
  static toListItemDtoArray(tasks: Task[]): TaskListItemDtoClass[] {
    return tasks.map(task => this.toListItemDto(task));
  }

  /**
   * Convierte un CreateTaskDto a datos para crear entidad
   */
  static fromCreateDto(dto: CreateTaskDto): Pick<Task, 'titulo' | 'descripcion'> {
    return {
      titulo: dto.titulo.trim(),
      descripcion: dto.descripcion?.trim() || null,
    };
  }

  /**
   * Mapea el enum público al tipo de la entidad
   */
  static mapEnumToStatus(status: TaskStatusEnum): TaskStatus {
    switch (status) {
      case TaskStatusEnum.PENDIENTE:
        return 'pendiente';
      case TaskStatusEnum.COMPLETADA:
        return 'completada';
      case TaskStatusEnum.CANCELADA:
        return 'cancelada';
      default:
        return 'pendiente';
    }
  }

  /**
   * Mapea el tipo de la entidad al enum público
   */
  static mapStatusToEnum(status: TaskStatus): TaskStatusEnum {
    switch (status) {
      case 'pendiente':
        return TaskStatusEnum.PENDIENTE;
      case 'completada':
        return TaskStatusEnum.COMPLETADA;
      case 'cancelada':
        return TaskStatusEnum.CANCELADA;
      default:
        return TaskStatusEnum.PENDIENTE;
    }
  }
}

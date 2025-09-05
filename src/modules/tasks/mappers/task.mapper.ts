import { plainToClass } from 'class-transformer';
import { Task, TaskStatus } from '../task.entity';
import { 
    TaskBaseDto, 
    CreateTaskDto, 
    TaskStatusEnum,
    TaskListItemDtoClass,
    TaskResponseDto
} from '../dto/task.dto';

export class TaskMapper {
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

    static toListItemDto(task: Task): TaskListItemDtoClass {
        return plainToClass(TaskListItemDtoClass, {
            id: task.id,
            titulo: task.titulo,
            status: this.mapStatusToEnum(task.status),
            fechaCreacion: task.fechaCreacion.toISOString(),
            fechaActualizacion: task.fechaActualizacion.toISOString()
        });
    }

    static toResponseDtoArray(tasks: Task[]): TaskBaseDto[] {
        return tasks.map(task => this.toResponseDto(task));
    }

    static toListItemDtoArray(tasks: Task[]): TaskListItemDtoClass[] {
        return tasks.map(task => this.toListItemDto(task));
    }

    static fromCreateDto(dto: CreateTaskDto): Pick<Task, 'titulo' | 'descripcion'> {
        return {
            titulo: dto.titulo.trim(),
            descripcion: dto.descripcion?.trim() || null,
        };
    }

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

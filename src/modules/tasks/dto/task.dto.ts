import { IsString, IsOptional, Length, IsEnum, IsNotEmpty, IsDateString, IsNumber } from 'class-validator';
import { Transform, Expose } from 'class-transformer';
import { OmitType, PickType, PickTypeClass } from '../../../common/types';

// Enum separado para no exponer la entidad
export enum TaskStatusEnum {
  PENDIENTE = 'pendiente',
  COMPLETADA = 'completada',
  CANCELADA = 'cancelada'
}

// DTO Base para Task (sin exponer la entidad)
export class TaskBaseDto {
  @IsNumber()
  @Expose()
  id!: number;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  @Expose()
  titulo!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  @Transform(({ value }) => value?.trim() || null)
  @Expose()
  descripcion?: string | null;

  @IsEnum(TaskStatusEnum, {
    message: 'El status debe ser: pendiente, completada o cancelada'
  })
  @Expose()
  status!: TaskStatusEnum;

  @IsDateString()
  @Expose()
  fechaCreacion!: string;

  @IsDateString()
  @Expose()
  fechaActualizacion!: string;
}

// DTO para crear tareas (solo campos necesarios)
export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100, { message: 'El título debe tener entre 1 y 100 caracteres' })
  @Transform(({ value }) => value?.trim())
  titulo!: string;

  @IsOptional()
  @IsString()
  @Length(0, 500, { message: 'La descripción no puede exceder 500 caracteres' })
  @Transform(({ value }) => value?.trim() || null)
  descripcion?: string | null;
}

// DTO para actualizar estado usando nuestro utility type
export type UpdateTaskStatusDto = PickType<TaskBaseDto, 'status'>;

// Implementación concreta de UpdateTaskStatusDto
export class UpdateTaskStatusDtoClass implements UpdateTaskStatusDto {
  @IsEnum(TaskStatusEnum, {
    message: 'El status debe ser: pendiente, completada o cancelada'
  })
  status!: TaskStatusEnum;
}

// DTO para parámetros de ruta
export class TaskParamsDto {
  @Transform(({ value }) => parseInt(value))
  @IsNotEmpty()
  @IsNumber({}, { message: 'ID debe ser un número válido' })
  id!: number;
}

// DTO de respuesta pública (sin campos sensibles)
export type TaskResponseDto = OmitType<TaskBaseDto, never>; // Por ahora no omitimos nada, pero podríamos omitir campos internos

// DTO para listado (podría omitir descripción para mejor performance)
export type TaskListItemDto = OmitType<TaskBaseDto, 'descripcion'>;

// Implementación concreta para TaskListItemDto
export class TaskListItemDtoClass implements TaskListItemDto {
  @IsNumber()
  @Expose()
  id!: number;

  @IsString()
  @Expose()
  titulo!: string;

  @IsEnum(TaskStatusEnum)
  @Expose()
  status!: TaskStatusEnum;

  @IsDateString()
  @Expose()
  fechaCreacion!: string;

  @IsDateString()
  @Expose()
  fechaActualizacion!: string;
}

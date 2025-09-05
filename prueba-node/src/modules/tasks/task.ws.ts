import { getIO } from '../../ws/io';
import { Task } from './task.entity';
import { logger } from '../../common/logger';

/**
 * Emite evento de nueva tarea creada
 */
export function emitNewTask(task: Task): void {
  const io = getIO();
  if (io) {
    io.emit('newTask', task);
    logger.websocket('newTask', 'broadcast', { taskId: task.id, titulo: task.titulo });
  }
}

/**
 * Emite evento de tarea actualizada
 */
export function emitTaskUpdated(id: number, status: Task['status']): void {
  const io = getIO();
  if (io) {
    io.emit('taskUpdated', { id, status });
    logger.websocket('taskUpdated', 'broadcast', { taskId: id, status });
  }
}

/**
 * Emite evento de tarea eliminada
 */
export function emitTaskDeleted(id: number): void {
  const io = getIO();
  if (io) {
    io.emit('taskDeleted', { id });
    logger.websocket('taskDeleted', 'broadcast', { taskId: id });
  }
}

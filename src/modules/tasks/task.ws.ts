import { getIO } from '../../ws/io';
import { Task } from './task.entity';
import { logger } from '../../common/logger';

export function emitNewTask(task: Task): void {
    const io = getIO();
    if (io) {
        io.emit('newTask', task);
        logger.websocket('newTask', 'broadcast', { taskId: task.id, titulo: task.titulo });
    }
}

export function emitTaskUpdated(id: number, status: Task['status']): void {
    const io = getIO();
    if (io) {
        io.emit('taskUpdated', { id, status });
        logger.websocket('taskUpdated', 'broadcast', { taskId: id, status });
    }
}

export function emitTaskDeleted(id: number): void {
    const io = getIO();
    if (io) {
        io.emit('taskDeleted', { id });
        logger.websocket('taskDeleted', 'broadcast', { taskId: id });
    }
}

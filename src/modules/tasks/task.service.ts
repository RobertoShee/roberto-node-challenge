import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { AppDataSource } from '../../config/data-source';
import { NotFoundError, DatabaseError } from '../../common/errors';
import { logger } from '../../common/logger';

export class TaskService {
    private repo: Repository<Task>;

    constructor() {
        this.repo = AppDataSource.getRepository(Task);
    }

    async list(): Promise<Task[]> {
        try {
            const startTime = Date.now();
            const tasks = await this.repo.find({ 
                order: { fechaCreacion: 'DESC' } 
            });
            
            logger.database('SELECT', 'tasks', Date.now() - startTime);
            return tasks;
        } catch (error) {
            logger.database('SELECT', 'tasks', undefined, error as Error);
            throw new DatabaseError('Error al obtener la lista de tareas', 'list');
        }
    }

    async create(input: Pick<Task, 'titulo' | 'descripcion'>): Promise<Task> {
        try {
            const startTime = Date.now();
            
            const task = this.repo.create({
                titulo: input.titulo,
                descripcion: input.descripcion ?? null,
            });
            
            const savedTask = await this.repo.save(task);
            
            logger.database('INSERT', 'tasks', Date.now() - startTime);
            logger.info(`Nueva tarea creada: ${savedTask.titulo}`, { 
                taskId: savedTask.id 
            });
            
            return savedTask;
        } catch (error) {
            logger.database('INSERT', 'tasks', undefined, error as Error);
            throw new DatabaseError('Error al crear la tarea', 'create');
        }
    }

    async updateStatus(id: number, status: Task['status']): Promise<Task> {
        try {
            const startTime = Date.now();
            
            const existing = await this.repo.findOneBy({ id });
            if (!existing) {
                throw new NotFoundError('Tarea', id);
            }

            const previousStatus = existing.status;
            existing.status = status;
            const updatedTask = await this.repo.save(existing);
            
            logger.database('UPDATE', 'tasks', Date.now() - startTime);
            logger.info(`Tarea actualizada: ${updatedTask.titulo}`, {
                taskId: id,
                previousStatus,
                newStatus: status
            });

            return updatedTask;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            logger.database('UPDATE', 'tasks', undefined, error as Error);
            throw new DatabaseError('Error al actualizar la tarea', 'updateStatus');
        }
    }

    async remove(id: number): Promise<void> {
        try {
            const startTime = Date.now();
            
            const existing = await this.repo.findOneBy({ id });
            if (!existing) {
                throw new NotFoundError('Tarea', id);
            }

            await this.repo.remove(existing);
            
            logger.database('DELETE', 'tasks', Date.now() - startTime);
            logger.info(`Tarea eliminada: ${existing.titulo}`, { 
                taskId: id 
            });

        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            logger.database('DELETE', 'tasks', undefined, error as Error);
            throw new DatabaseError('Error al eliminar la tarea', 'remove');
        }
    }

    async findById(id: number): Promise<Task> {
        try {
            const startTime = Date.now();
            
            const task = await this.repo.findOneBy({ id });
            if (!task) {
                throw new NotFoundError('Tarea', id);
            }

            logger.database('SELECT', 'tasks', Date.now() - startTime);
            return task;
        } catch (error) {
            if (error instanceof NotFoundError) {
                throw error;
            }
            logger.database('SELECT', 'tasks', undefined, error as Error);
            throw new DatabaseError('Error al obtener la tarea', 'findById');
        }
    }
}

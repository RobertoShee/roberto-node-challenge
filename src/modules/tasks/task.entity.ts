import {
  Entity, PrimaryGeneratedColumn, Column,
  CreateDateColumn, UpdateDateColumn, Index
} from 'typeorm';

export type TaskStatus = 'pendiente' | 'completada' | 'cancelada';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  titulo!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  descripcion?: string | null;

  @Column({ type: 'varchar', default: 'pendiente' })
  status!: TaskStatus;

  @CreateDateColumn({ 
    name: 'fecha_creacion',
    type: 'datetime',
    default: () => "datetime('now')"
  })
  fechaCreacion!: Date;

  @UpdateDateColumn({ 
    name: 'fecha_actualizacion',
    type: 'datetime'
  })
  fechaActualizacion!: Date;
}

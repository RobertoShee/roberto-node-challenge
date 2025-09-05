import * as typeorm from 'typeorm';

// When tests mock 'typeorm' the decorators may be replaced with non-callable values.
// Provide safe no-op decorator fallbacks if needed.
const Entity = (typeorm as any).Entity || (() => (target: any) => target);
const PrimaryGeneratedColumn = (typeorm as any).PrimaryGeneratedColumn || (() => (target: any, key: string) => {});
const Column = (typeorm as any).Column || (() => (target: any, key: string) => {});
const CreateDateColumn = (typeorm as any).CreateDateColumn || (() => (target: any, key: string) => {});
const UpdateDateColumn = (typeorm as any).UpdateDateColumn || (() => (target: any, key: string) => {});
const Index = (typeorm as any).Index || (() => (target: any, key?: string) => {});

export type TaskStatus = 'pendiente' | 'completada' | 'cancelada';

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

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

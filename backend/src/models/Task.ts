import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { Project } from './Project';
import { User } from './User';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  })
  status!: 'pending' | 'in-progress' | 'completed';

  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  })
  priority!: 'low' | 'medium' | 'high';

  @Column({ type: 'datetime', nullable: true })
  dueDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Project, project => project.tasks, { onDelete: 'CASCADE' })
  project!: Project;

  @ManyToOne(() => User, user => user.assignedTasks, { nullable: true })
  assignedUser!: User | null;
}

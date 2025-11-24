import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  JoinTable
} from 'typeorm';
import { User } from './User';
import { Task } from './Task';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  color!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, user => user.ownedProjects)
  owner!: User;

  @ManyToMany(() => User, user => user.collaboratedProjects)
  @JoinTable()
  collaborators!: User[];

  @OneToMany(() => Task, task => task.project)
  tasks!: Task[];
}

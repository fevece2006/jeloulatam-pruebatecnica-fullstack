import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Project, project => project.owner)
  ownedProjects!: Project[];

  @ManyToMany(() => Project, project => project.collaborators)
  collaboratedProjects!: Project[];

  @OneToMany(() => Task, task => task.assignedUser)
  assignedTasks!: Task[];
}
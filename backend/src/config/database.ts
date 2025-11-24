import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'app_user',
  password: process.env.DB_PASSWORD || 'userpassword',
  database: process.env.DB_NAME || 'project_management',
  synchronize: process.env.NODE_ENV !== 'production', // true en desarrollo
  logging: process.env.NODE_ENV === 'development',
  entities: [User, Project, Task],
  migrations: ['src/migrations/**/*.ts'],
  subscribers: [],
  connectorPackage: 'mysql2',
  extra: {
    charset: 'utf8mb4_unicode_ci',
  },
});
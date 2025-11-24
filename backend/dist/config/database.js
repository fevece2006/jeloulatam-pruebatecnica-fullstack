"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'app_user',
    password: process.env.DB_PASSWORD || 'userpassword',
    database: process.env.DB_NAME || 'project_management',
    synchronize: process.env.NODE_ENV !== 'production', // true en desarrollo
    logging: process.env.NODE_ENV === 'development',
    entities: [User_1.User, Project_1.Project, Task_1.Task],
    migrations: ['src/migrations/**/*.ts'],
    subscribers: [],
    connectorPackage: 'mysql2',
    extra: {
        charset: 'utf8mb4_unicode_ci',
    },
});

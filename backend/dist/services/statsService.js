"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsService = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
class StatsService {
    async getUserStats(userId) {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const projectRepository = database_1.AppDataSource.getRepository(Project_1.Project);
        const taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
        const totalProjects = await projectRepository.count({
            where: { owner: { id: userId } }
        });
        const totalTasks = await taskRepository
            .createQueryBuilder('task')
            .innerJoin('task.project', 'project')
            .leftJoin('project.collaborators', 'collaborator')
            .where('project.ownerId = :userId OR collaborator.id = :userId', { userId })
            .getCount();
        const tasksByStatus = await taskRepository
            .createQueryBuilder('task')
            .select('task.status, COUNT(task.id) as count')
            .innerJoin('task.project', 'project')
            .leftJoin('project.collaborators', 'collaborator')
            .where('project.ownerId = :userId OR collaborator.id = :userId', { userId })
            .groupBy('task.status')
            .getRawMany();
        return {
            totalProjects,
            totalTasks,
            tasksByStatus: tasksByStatus.reduce((acc, item) => {
                acc[item.task_status] = parseInt(item.count);
                return acc;
            }, {})
        };
    }
}
exports.StatsService = StatsService;

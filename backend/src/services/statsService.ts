import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

export class StatsService {
  async getUserStats(userId: number) {
    const userRepository = AppDataSource.getRepository(User);
    const projectRepository = AppDataSource.getRepository(Project);
    const taskRepository = AppDataSource.getRepository(Task);

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
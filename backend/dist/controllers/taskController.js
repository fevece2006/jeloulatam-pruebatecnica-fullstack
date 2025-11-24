"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const database_1 = require("../config/database");
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');
class TaskController {
    constructor() {
        this.taskRepository = database_1.AppDataSource.getRepository(Task_1.Task);
        this.projectRepository = database_1.AppDataSource.getRepository(Project_1.Project);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.getTasks = async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const userId = req.user.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 20;
                const skip = (page - 1) * limit;
                // Filters
                const status = req.query.status;
                const priority = req.query.priority;
                const projectId = req.query.projectId ? parseInt(req.query.projectId) : null;
                const assignedUserId = req.query.assignedUserId ? parseInt(req.query.assignedUserId) : null;
                const sortBy = req.query.sortBy || 'createdAt';
                const sortOrder = req.query.sortOrder || 'DESC';
                let query = this.taskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.project', 'project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .leftJoinAndSelect('task.assignedUser', 'assignedUser')
                    .where('(project.ownerId = :userId OR collaborators.id = :userId)', { userId });
                if (status) {
                    query = query.andWhere('task.status = :status', { status });
                }
                if (priority) {
                    query = query.andWhere('task.priority = :priority', { priority });
                }
                if (projectId) {
                    query = query.andWhere('task.projectId = :projectId', { projectId });
                }
                if (assignedUserId) {
                    query = query.andWhere('task.assignedUserId = :assignedUserId', { assignedUserId });
                }
                // Validate sortBy field
                const validSortFields = ['createdAt', 'dueDate', 'priority', 'status', 'title'];
                const sortField = validSortFields.includes(sortBy) ? `task.${sortBy}` : 'task.createdAt';
                const [tasks, total] = await query
                    .skip(skip)
                    .take(limit)
                    .orderBy(sortField, sortOrder)
                    .getManyAndCount();
                // Sanitize passwords
                const sanitizedTasks = tasks.map(task => ({
                    ...task,
                    project: {
                        ...task.project,
                        owner: this.sanitizeUser(task.project.owner),
                        collaborators: task.project.collaborators.map(c => this.sanitizeUser(c))
                    },
                    assignedUser: task.assignedUser ? this.sanitizeUser(task.assignedUser) : null
                }));
                res.json({
                    tasks: sanitizedTasks,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                });
            }
            catch (error) {
                console.error('Error getting tasks:', error);
                res.status(500).json({ message: 'Error al obtener tareas' });
            }
        };
        this.getTaskById = async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const userId = req.user.userId;
                const taskId = parseInt(req.params.id);
                const task = await this.taskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.project', 'project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .leftJoinAndSelect('task.assignedUser', 'assignedUser')
                    .where('task.id = :taskId', { taskId })
                    .andWhere('(project.ownerId = :userId OR collaborators.id = :userId)', { userId })
                    .getOne();
                if (!task) {
                    return res.status(404).json({ message: 'Tarea no encontrada' });
                }
                res.json({
                    ...task,
                    project: {
                        ...task.project,
                        owner: this.sanitizeUser(task.project.owner),
                        collaborators: task.project.collaborators.map(c => this.sanitizeUser(c))
                    },
                    assignedUser: task.assignedUser ? this.sanitizeUser(task.assignedUser) : null
                });
            }
            catch (error) {
                console.error('Error getting task:', error);
                res.status(500).json({ message: 'Error al obtener tarea' });
            }
        };
        this.createTask = async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const userId = req.user.userId;
                const { title, description, projectId, status, priority, dueDate, assignedUserId } = req.body;
                // Verify project exists and user has access
                const project = await this.projectRepository
                    .createQueryBuilder('project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .where('project.id = :projectId', { projectId })
                    .andWhere('(project.ownerId = :userId OR collaborators.id = :userId)', { userId })
                    .getOne();
                if (!project) {
                    return res.status(404).json({ message: 'Proyecto no encontrado o acceso denegado' });
                }
                // Verify assigned user if provided
                let assignedUser = null;
                if (assignedUserId) {
                    const isCollaborator = project.collaborators.some(c => c.id === assignedUserId) || project.owner.id === assignedUserId;
                    if (!isCollaborator) {
                        return res.status(400).json({ message: 'El usuario asignado debe ser colaborador del proyecto' });
                    }
                    assignedUser = await this.userRepository.findOne({ where: { id: assignedUserId } });
                }
                const task = this.taskRepository.create({
                    title,
                    description: description || '',
                    status: status || 'pending',
                    priority: priority || 'medium',
                    dueDate: dueDate || null,
                    project,
                    assignedUser
                });
                await this.taskRepository.save(task);
                // Load full relations
                const savedTask = await this.taskRepository.findOne({
                    where: { id: task.id },
                    relations: ['project', 'project.owner', 'project.collaborators', 'assignedUser']
                });
                res.status(201).json({
                    ...savedTask,
                    project: {
                        ...savedTask.project,
                        owner: this.sanitizeUser(savedTask.project.owner),
                        collaborators: savedTask.project.collaborators.map(c => this.sanitizeUser(c))
                    },
                    assignedUser: savedTask.assignedUser ? this.sanitizeUser(savedTask.assignedUser) : null
                });
            }
            catch (error) {
                console.error('Error creating task:', error);
                res.status(500).json({ message: 'Error al crear tarea' });
            }
        };
        this.updateTask = async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const userId = req.user.userId;
                const taskId = parseInt(req.params.id);
                const { title, description, status, priority, dueDate, assignedUserId } = req.body;
                const task = await this.taskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.project', 'project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .leftJoinAndSelect('task.assignedUser', 'assignedUser')
                    .where('task.id = :taskId', { taskId })
                    .andWhere('(project.ownerId = :userId OR collaborators.id = :userId)', { userId })
                    .getOne();
                if (!task) {
                    return res.status(404).json({ message: 'Tarea no encontrada o acceso denegado' });
                }
                // Update fields
                if (title !== undefined)
                    task.title = title;
                if (description !== undefined)
                    task.description = description;
                if (status !== undefined)
                    task.status = status;
                if (priority !== undefined)
                    task.priority = priority;
                if (dueDate !== undefined)
                    task.dueDate = dueDate;
                // Update assigned user
                if (assignedUserId !== undefined) {
                    if (assignedUserId === null) {
                        task.assignedUser = null;
                    }
                    else {
                        const isCollaborator = task.project.collaborators.some(c => c.id === assignedUserId) || task.project.owner.id === assignedUserId;
                        if (!isCollaborator) {
                            return res.status(400).json({ message: 'El usuario asignado debe ser colaborador del proyecto' });
                        }
                        const assignedUser = await this.userRepository.findOne({ where: { id: assignedUserId } });
                        if (!assignedUser) {
                            return res.status(404).json({ message: 'Usuario asignado no encontrado' });
                        }
                        task.assignedUser = assignedUser;
                    }
                }
                await this.taskRepository.save(task);
                res.json({
                    ...task,
                    project: {
                        ...task.project,
                        owner: this.sanitizeUser(task.project.owner),
                        collaborators: task.project.collaborators.map(c => this.sanitizeUser(c))
                    },
                    assignedUser: task.assignedUser ? this.sanitizeUser(task.assignedUser) : null
                });
            }
            catch (error) {
                console.error('Error updating task:', error);
                res.status(500).json({ message: 'Error al actualizar tarea' });
            }
        };
        this.deleteTask = async (req, res) => {
            try {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                const userId = req.user.userId;
                const taskId = parseInt(req.params.id);
                const task = await this.taskRepository
                    .createQueryBuilder('task')
                    .leftJoinAndSelect('task.project', 'project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .where('task.id = :taskId', { taskId })
                    .andWhere('(project.ownerId = :userId OR collaborators.id = :userId)', { userId })
                    .getOne();
                if (!task) {
                    return res.status(404).json({ message: 'Tarea no encontrada o acceso denegado' });
                }
                await this.taskRepository.remove(task);
                res.json({ message: 'Tarea eliminada exitosamente' });
            }
            catch (error) {
                console.error('Error deleting task:', error);
                res.status(500).json({ message: 'Error al eliminar tarea' });
            }
        };
    }
    sanitizeUser(user) {
        if (!user)
            return null;
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.TaskController = TaskController;

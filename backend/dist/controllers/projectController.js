"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const database_1 = require("../config/database");
const Project_1 = require("../models/Project");
const User_1 = require("../models/User");
const controllerHelpers_1 = require("../utils/controllerHelpers");
const projectHelpers_1 = require("../utils/projectHelpers");
class ProjectController {
    constructor() {
        this.projectRepository = database_1.AppDataSource.getRepository(Project_1.Project);
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.getProjects = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const search = req.query.search || '';
                const skip = (page - 1) * limit;
                let query = this.projectRepository
                    .createQueryBuilder('project')
                    .leftJoinAndSelect('project.owner', 'owner')
                    .leftJoinAndSelect('project.collaborators', 'collaborators')
                    .where('project.ownerId = :userId', { userId })
                    .orWhere('collaborators.id = :userId', { userId });
                if (search) {
                    query = query.andWhere('(project.name LIKE :search OR project.description LIKE :search)', { search: `%${search}%` });
                }
                const [projects, total] = await query
                    .skip(skip)
                    .take(limit)
                    .orderBy('project.createdAt', 'DESC')
                    .getManyAndCount();
                const sanitizedProjects = projects.map(controllerHelpers_1.sanitizeProject);
                res.json({
                    projects: sanitizedProjects,
                    pagination: {
                        total,
                        page,
                        limit,
                        totalPages: Math.ceil(total / limit)
                    }
                });
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al obtener proyectos');
            }
        };
        this.createProject = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const { name, description, color } = req.body;
                const user = await this.userRepository.findOne({ where: { id: userId } });
                if (!user) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                const project = this.projectRepository.create({
                    name,
                    description: description || '',
                    color,
                    owner: user
                });
                await this.projectRepository.save(project);
                // Load relations
                const savedProject = await this.projectRepository.findOne({
                    where: { id: project.id },
                    relations: ['owner', 'collaborators']
                });
                res.status(201).json((0, controllerHelpers_1.sanitizeProject)(savedProject));
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al crear proyecto');
            }
        };
        this.updateProject = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const projectId = parseInt(req.params.id);
                const { name, description, color } = req.body;
                const project = await (0, projectHelpers_1.getProjectWithOwnerPermission)(projectId, userId, res, 'No tienes permiso para editar este proyecto');
                if (!project)
                    return;
                if (name !== undefined)
                    project.name = name;
                if (description !== undefined)
                    project.description = description;
                if (color !== undefined)
                    project.color = color;
                await this.projectRepository.save(project);
                res.json((0, controllerHelpers_1.sanitizeProject)(project));
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al actualizar proyecto');
            }
        };
        this.deleteProject = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const projectId = parseInt(req.params.id);
                const project = await (0, projectHelpers_1.getProjectWithOwnerPermission)(projectId, userId, res, 'No tienes permiso para eliminar este proyecto');
                if (!project)
                    return;
                await this.projectRepository.remove(project);
                res.json({ message: 'Proyecto eliminado exitosamente' });
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al eliminar proyecto');
            }
        };
        this.addCollaborator = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const projectId = parseInt(req.params.id);
                const { userId: collaboratorId } = req.body;
                const project = await (0, projectHelpers_1.getProjectWithOwnerPermission)(projectId, userId, res, 'No tienes permiso para añadir colaboradores');
                if (!project)
                    return;
                const collaborator = await this.userRepository.findOne({ where: { id: collaboratorId } });
                if (!collaborator) {
                    return res.status(404).json({ message: 'Usuario no encontrado' });
                }
                // Check if already a collaborator
                const isAlreadyCollaborator = project.collaborators.some(c => c.id === collaboratorId);
                if (isAlreadyCollaborator) {
                    return res.status(400).json({ message: 'El usuario ya es colaborador' });
                }
                // Check if owner
                if (project.owner.id === collaboratorId) {
                    return res.status(400).json({ message: 'El propietario no puede ser añadido como colaborador' });
                }
                project.collaborators.push(collaborator);
                await this.projectRepository.save(project);
                res.json((0, controllerHelpers_1.sanitizeProject)(project));
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al añadir colaborador');
            }
        };
        this.addCollaborators = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const projectId = parseInt(req.params.id);
                const { userIds } = req.body;
                // Validate userIds is array
                if (!Array.isArray(userIds) || userIds.length === 0) {
                    return res.status(400).json({ message: 'userIds debe ser un array con al menos un ID' });
                }
                const project = await (0, projectHelpers_1.getProjectWithOwnerPermission)(projectId, userId, res, 'No tienes permiso para añadir colaboradores');
                if (!project)
                    return;
                const addedCollaborators = [];
                const skippedCollaborators = [];
                const notFoundUsers = [];
                for (const collaboratorId of userIds) {
                    // Check if owner
                    if (project.owner.id === collaboratorId) {
                        skippedCollaborators.push({
                            userId: collaboratorId,
                            reason: 'El propietario no puede ser colaborador'
                        });
                        continue;
                    }
                    // Check if already a collaborator
                    const isAlreadyCollaborator = project.collaborators.some(c => c.id === collaboratorId);
                    if (isAlreadyCollaborator) {
                        skippedCollaborators.push({
                            userId: collaboratorId,
                            reason: 'Ya es colaborador'
                        });
                        continue;
                    }
                    // Find user
                    const collaborator = await this.userRepository.findOne({ where: { id: collaboratorId } });
                    if (!collaborator) {
                        notFoundUsers.push(collaboratorId);
                        continue;
                    }
                    // Add collaborator
                    project.collaborators.push(collaborator);
                    addedCollaborators.push((0, controllerHelpers_1.sanitizeUser)(collaborator));
                }
                // Save if there are new collaborators
                if (addedCollaborators.length > 0) {
                    await this.projectRepository.save(project);
                }
                res.json({
                    message: `Se agregaron ${addedCollaborators.length} colaborador(es)`,
                    added: addedCollaborators,
                    skipped: skippedCollaborators,
                    notFound: notFoundUsers,
                    project: (0, controllerHelpers_1.sanitizeProject)(project)
                });
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al añadir colaboradores');
            }
        };
        this.removeCollaborator = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const userId = req.user.userId;
                const projectId = parseInt(req.params.id);
                const { userId: collaboratorId } = req.body;
                const project = await (0, projectHelpers_1.getProjectWithOwnerPermission)(projectId, userId, res, 'No tienes permiso para eliminar colaboradores');
                if (!project)
                    return;
                // Check if user is a collaborator
                const collaboratorIndex = project.collaborators.findIndex(c => c.id === collaboratorId);
                if (collaboratorIndex === -1) {
                    return res.status(400).json({ message: 'El usuario no es colaborador del proyecto' });
                }
                project.collaborators.splice(collaboratorIndex, 1);
                await this.projectRepository.save(project);
                res.json((0, controllerHelpers_1.sanitizeProject)(project));
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al eliminar colaborador');
            }
        };
        this.getCollaborators = async (req, res) => {
            try {
                if (!(0, controllerHelpers_1.validateRequest)(req, res))
                    return;
                const projectId = parseInt(req.params.id);
                const project = await (0, projectHelpers_1.getProjectOrNotFound)(projectId, res, ['collaborators']);
                if (!project)
                    return;
                const collaborators = project.collaborators.map(controllerHelpers_1.sanitizeUser);
                res.json({ collaborators });
            }
            catch (error) {
                (0, controllerHelpers_1.handleError)(res, error, 'Error al obtener colaboradores');
            }
        };
    }
}
exports.ProjectController = ProjectController;

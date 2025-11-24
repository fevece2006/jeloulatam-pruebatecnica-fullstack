"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectWithOwnerPermission = exports.verifyProjectOwner = exports.getProjectOrNotFound = exports.getProjectById = void 0;
const database_1 = require("../config/database");
const Project_1 = require("../models/Project");
const projectRepository = database_1.AppDataSource.getRepository(Project_1.Project);
/**
 * Gets a project by ID with relations
 * @param projectId Project ID
 * @param relations Array of relations to load (default: ['owner', 'collaborators'])
 * @returns Project or null if not found
 */
const getProjectById = async (projectId, relations = ['owner', 'collaborators']) => {
    return await projectRepository.findOne({
        where: { id: projectId },
        relations
    });
};
exports.getProjectById = getProjectById;
/**
 * Gets a project and verifies it exists
 * Sends 404 response if not found
 * @returns Project or null (if null, response already sent)
 */
const getProjectOrNotFound = async (projectId, res, relations = ['owner', 'collaborators']) => {
    const project = await (0, exports.getProjectById)(projectId, relations);
    if (!project) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return null;
    }
    return project;
};
exports.getProjectOrNotFound = getProjectOrNotFound;
/**
 * Verifies if user is the owner of the project
 * Sends 403 response if not owner
 * @returns true if owner, false otherwise (response already sent)
 */
const verifyProjectOwner = (project, userId, res, errorMessage = 'No tienes permiso para realizar esta acción') => {
    if (project.owner.id !== userId) {
        res.status(403).json({ message: errorMessage });
        return false;
    }
    return true;
};
exports.verifyProjectOwner = verifyProjectOwner;
/**
 * Gets a project and verifies user is the owner
 * Combines getProjectOrNotFound + verifyProjectOwner
 * @returns Project or null (if null, response already sent)
 */
const getProjectWithOwnerPermission = async (projectId, userId, res, errorMessage = 'No tienes permiso para realizar esta acción') => {
    const project = await (0, exports.getProjectOrNotFound)(projectId, res);
    if (!project)
        return null;
    if (!(0, exports.verifyProjectOwner)(project, userId, res, errorMessage)) {
        return null;
    }
    return project;
};
exports.getProjectWithOwnerPermission = getProjectWithOwnerPermission;

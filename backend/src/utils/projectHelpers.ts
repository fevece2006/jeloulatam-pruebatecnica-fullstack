import { AppDataSource } from '../config/database';
import { Project } from '../models/Project';
import { Response } from 'express';

const projectRepository = AppDataSource.getRepository(Project);

/**
 * Gets a project by ID with relations
 * @param projectId Project ID
 * @param relations Array of relations to load (default: ['owner', 'collaborators'])
 * @returns Project or null if not found
 */
export const getProjectById = async (
  projectId: number,
  relations: string[] = ['owner', 'collaborators']
): Promise<Project | null> => {
  return await projectRepository.findOne({
    where: { id: projectId },
    relations
  });
};

/**
 * Gets a project and verifies it exists
 * Sends 404 response if not found
 * @returns Project or null (if null, response already sent)
 */
export const getProjectOrNotFound = async (
  projectId: number,
  res: Response,
  relations: string[] = ['owner', 'collaborators']
): Promise<Project | null> => {
  const project = await getProjectById(projectId, relations);
  
  if (!project) {
    res.status(404).json({ message: 'Proyecto no encontrado' });
    return null;
  }
  
  return project;
};

/**
 * Verifies if user is the owner of the project
 * Sends 403 response if not owner
 * @returns true if owner, false otherwise (response already sent)
 */
export const verifyProjectOwner = (
  project: Project,
  userId: number,
  res: Response,
  errorMessage: string = 'No tienes permiso para realizar esta acción'
): boolean => {
  if (project.owner.id !== userId) {
    res.status(403).json({ message: errorMessage });
    return false;
  }
  return true;
};

/**
 * Gets a project and verifies user is the owner
 * Combines getProjectOrNotFound + verifyProjectOwner
 * @returns Project or null (if null, response already sent)
 */
export const getProjectWithOwnerPermission = async (
  projectId: number,
  userId: number,
  res: Response,
  errorMessage: string = 'No tienes permiso para realizar esta acción'
): Promise<Project | null> => {
  const project = await getProjectOrNotFound(projectId, res);
  if (!project) return null;
  
  if (!verifyProjectOwner(project, userId, res, errorMessage)) {
    return null;
  }
  
  return project;
};

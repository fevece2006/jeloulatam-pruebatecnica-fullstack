import { Router } from 'express';
import { ProjectController } from '../controllers/projectController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body, param, query } = require('express-validator');
import { authenticateToken } from '../middleware/auth';

const router = Router();
const projectController = new ProjectController();

router.use(authenticateToken);

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('search').optional().trim()
], projectController.getProjects);

router.post('/', [
  body('name').notEmpty().trim(),
  body('description').optional().trim(),
  body('color').isHexColor()
], projectController.createProject);

router.put('/:id', [
  param('id').isInt(),
  body('name').optional().trim(),
  body('description').optional().trim(),
  body('color').optional().isHexColor()
], projectController.updateProject);

router.delete('/:id', [
  param('id').isInt()
], projectController.deleteProject);

router.post('/:id/collaborators', [
  param('id').isInt(),
  body('userId').isInt()
], projectController.addCollaborator);

router.post('/:id/collaborators/bulk', [
  param('id').isInt(),
  body('userIds').isArray({ min: 1 })
], projectController.addCollaborators);

router.delete('/:id/collaborators', [
  param('id').isInt(),
  body('userId').isInt()
], projectController.removeCollaborator);

router.get('/:id/collaborators', [
  param('id').isInt()
], projectController.getCollaborators);

export default router;
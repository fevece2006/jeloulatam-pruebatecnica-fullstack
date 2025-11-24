import { Router } from 'express';
import { TaskController } from '../controllers/taskController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body, param, query } = require('express-validator');
import { authenticateToken } from '../middleware/auth';

const router = Router();
const taskController = new TaskController();

router.use(authenticateToken);

router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'in-progress', 'completed']),
  query('priority').optional().isIn(['low', 'medium', 'high']),
  query('projectId').optional().isInt(),
  query('assignedUserId').optional().isInt(),
  query('sortBy').optional().isIn(['createdAt', 'dueDate', 'priority', 'status', 'title']),
  query('sortOrder').optional().isIn(['ASC', 'DESC'])
], taskController.getTasks);

router.get('/:id', [
  param('id').isInt()
], taskController.getTaskById);

router.post('/', [
  body('title').notEmpty().trim(),
  body('description').optional().trim(),
  body('projectId').isInt(),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
  body('assignedUserId').optional().isInt()
], taskController.createTask);

router.put('/:id', [
  param('id').isInt(),
  body('title').optional().trim(),
  body('description').optional().trim(),
  body('status').optional().isIn(['pending', 'in-progress', 'completed']),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('dueDate').optional().isISO8601(),
  body('assignedUserId').optional().isInt()
], taskController.updateTask);

router.delete('/:id', [
  param('id').isInt()
], taskController.deleteTask);

export default router;

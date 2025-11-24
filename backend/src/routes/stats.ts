import { Router } from 'express';
import { StatsController } from '../controllers/statsController';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const statsController = new StatsController();

router.use(authenticateToken);

router.get('/', statsController.getUserStats);

export default router;

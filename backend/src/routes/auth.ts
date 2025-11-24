import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { body } = require('express-validator');
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').notEmpty().trim()
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], login);

router.get('/profile', authenticateToken, getProfile);

export default router;
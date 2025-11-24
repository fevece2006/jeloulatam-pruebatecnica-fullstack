import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ message: error instanceof Error ? error.message : 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await authService.login(email, password);
    
    res.json(result);
  } catch (error) {
    res.status(401).json({ message: error instanceof Error ? error.message : 'Login failed' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.userId;
    const user = await authService.getUserProfile(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};
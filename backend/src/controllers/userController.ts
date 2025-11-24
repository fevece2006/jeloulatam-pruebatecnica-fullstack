import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { handleError } from '../utils/controllerHelpers';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    
    const users = await userRepository.find({
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt']
    });
    
    res.json(users);
  } catch (error) {
    handleError(res, error, 'Error al obtener usuarios');
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    
    const user = await userRepository.findOne({
      where: { id: parseInt(id) },
      select: ['id', 'email', 'name', 'createdAt', 'updatedAt']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    handleError(res, error, 'Error al obtener usuario');
  }
};

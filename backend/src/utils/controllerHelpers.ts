import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { validationResult } = require('express-validator');

/**
 * Validates request using express-validator
 * Returns true if valid, false if invalid (and sends error response)
 */
export const validateRequest = (req: AuthRequest, res: Response): boolean => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return false;
  }
  return true;
};

/**
 * Handles standard error responses
 */
export const handleError = (res: Response, error: any, message: string): void => {
  console.error(`${message}:`, error);
  res.status(500).json({ message });
};

/**
 * Removes password from user object
 */
export const sanitizeUser = (user: any): any => {
  if (!user) return null;
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

/**
 * Sanitizes project with owner and collaborators
 */
export const sanitizeProject = (project: any): any => {
  return {
    ...project,
    owner: sanitizeUser(project.owner),
    collaborators: project.collaborators?.map((c: any) => sanitizeUser(c)) || []
  };
};

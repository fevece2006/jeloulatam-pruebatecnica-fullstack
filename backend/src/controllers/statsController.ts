import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { StatsService } from '../services/statsService';

export class StatsController {
  private statsService = new StatsService();

  getUserStats = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user.userId;
      const stats = await this.statsService.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error('Error getting stats:', error);
      res.status(500).json({ message: 'Error al obtener estadísticas' });
    }
  };
}

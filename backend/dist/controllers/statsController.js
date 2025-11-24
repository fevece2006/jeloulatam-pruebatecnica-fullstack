"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatsController = void 0;
const statsService_1 = require("../services/statsService");
class StatsController {
    constructor() {
        this.statsService = new statsService_1.StatsService();
        this.getUserStats = async (req, res) => {
            try {
                const userId = req.user.userId;
                const stats = await this.statsService.getUserStats(userId);
                res.json(stats);
            }
            catch (error) {
                console.error('Error getting stats:', error);
                res.status(500).json({ message: 'Error al obtener estadísticas' });
            }
        };
    }
}
exports.StatsController = StatsController;

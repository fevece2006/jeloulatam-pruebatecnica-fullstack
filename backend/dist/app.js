"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const database_1 = require("./config/database");
const swagger_1 = require("./config/swagger");
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const stats_1 = __importDefault(require("./routes/stats"));
const users_1 = __importDefault(require("./routes/users"));
const app = (0, express_1.default)();
// Middleware de seguridad
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json({ limit: '10mb' }));
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // máximo 100 requests por ventana
});
app.use(limiter);
// Database connection
database_1.AppDataSource.initialize()
    .then(() => {
    console.log('Conectado a la base de datos');
})
    .catch(error => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/stats', stats_1.default);
app.use('/api/users', users_1.default);
// Swagger documentation
app.use('/api/docs', swagger_1.swaggerUi.serve, swagger_1.swaggerUi.setup(swagger_1.specs));
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Algo salió mal!' });
});
exports.default = app;

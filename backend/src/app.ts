import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { AppDataSource } from './config/database';
import { swaggerUi, specs } from './config/swagger';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import statsRoutes from './routes/stats';
import userRoutes from './routes/users';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // máximo 100 requests por ventana
});
app.use(limiter);

// Database connection
AppDataSource.initialize()
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch(error => {
    console.error('Error de conexión a la base de datos:', error);
    process.exit(1);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/users', userRoutes);

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

export default app;
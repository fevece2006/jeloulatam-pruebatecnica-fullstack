import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

let testUser: any;
let authToken: string;

beforeAll(async () => {
  // Create test user
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.delete({ email: 'stats-test@example.com' });

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Stats Test User',
      email: 'stats-test@example.com',
      password: 'password123'
    });

  testUser = registerResponse.body.user;
  authToken = registerResponse.body.token;

  // Create a test project and task for stats
  await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      name: 'Stats Test Project',
      description: 'For testing stats',
      color: '#0000FF'
    });
});

afterAll(async () => {
  // Clean up test data
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.delete({ id: testUser.id });
});

describe('Stats API', () => {
  describe('GET /api/stats', () => {
    it('should get user statistics', async () => {
      const response = await request(app)
        .get('/api/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('totalProjects');
      expect(response.body).toHaveProperty('totalTasks');
      expect(response.body).toHaveProperty('tasksByStatus');
      expect(typeof response.body.totalProjects).toBe('number');
      expect(typeof response.body.totalTasks).toBe('number');
      expect(typeof response.body.tasksByStatus).toBe('object');
    });

    it('should not get stats without authentication', async () => {
      const response = await request(app)
        .get('/api/stats');

      expect(response.status).toBe(401);
    });

    it('should return correct project count', async () => {
      const response = await request(app)
        .get('/api/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.totalProjects).toBeGreaterThanOrEqual(1);
    });
  });
});

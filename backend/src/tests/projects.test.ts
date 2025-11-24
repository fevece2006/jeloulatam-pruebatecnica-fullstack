import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Project } from '../models/Project';

let testUser: any;
let authToken: string;
let testProject: any;

beforeAll(async () => {
  // Create test user
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.delete({ email: 'project-test@example.com' });

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Project Test User',
      email: 'project-test@example.com',
      password: 'password123'
    });

  testUser = registerResponse.body.user;
  authToken = registerResponse.body.token;
});

afterAll(async () => {
  // Clean up test data
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  
  await projectRepo.delete({ owner: { id: testUser.id } });
  await userRepo.delete({ id: testUser.id });
});

describe('Projects API', () => {
  describe('POST /api/projects', () => {
    it('should create a new project', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Test Project',
          description: 'Test project description',
          color: '#FF5733'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Test Project');
      expect(response.body.description).toBe('Test project description');
      expect(response.body.color).toBe('#FF5733');
      expect(response.body.owner.id).toBe(testUser.id);

      testProject = response.body;
    });

    it('should not create project without authentication', async () => {
      const response = await request(app)
        .post('/api/projects')
        .send({
          name: 'Unauthorized Project',
          description: 'Should fail',
          color: '#000000'
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing name'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/projects', () => {
    it('should get list of projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('projects');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.projects)).toBe(true);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/projects?page=1&limit=5')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(5);
    });

    it('should support search', async () => {
      const response = await request(app)
        .get('/api/projects?search=Test')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.projects.length).toBeGreaterThan(0);
    });
  });

  describe('PUT /api/projects/:id', () => {
    it('should update own project', async () => {
      const response = await request(app)
        .put(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated Project Name',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Project Name');
      expect(response.body.description).toBe('Updated description');
    });

    it('should not update non-existent project', async () => {
      const response = await request(app)
        .put('/api/projects/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Should fail'
        });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/projects/:id', () => {
    it('should delete own project', async () => {
      const response = await request(app)
        .delete(`/api/projects/${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});

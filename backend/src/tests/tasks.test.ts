import request from 'supertest';
import app from '../app';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Project } from '../models/Project';
import { Task } from '../models/Task';

let testUser: any;
let authToken: string;
let testProject: any;
let testTask: any;

beforeAll(async () => {
  // Create test user
  const userRepo = AppDataSource.getRepository(User);
  await userRepo.delete({ email: 'task-test@example.com' });

  const registerResponse = await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Task Test User',
      email: 'task-test@example.com',
      password: 'password123'
    });

  testUser = registerResponse.body.user;
  authToken = registerResponse.body.token;

  // Create test project
  const projectResponse = await request(app)
    .post('/api/projects')
    .set('Authorization', `Bearer ${authToken}`)
    .send({
      name: 'Task Test Project',
      description: 'For testing tasks',
      color: '#00FF00'
    });

  testProject = projectResponse.body;
});

afterAll(async () => {
  // Clean up test data
  const userRepo = AppDataSource.getRepository(User);
  const projectRepo = AppDataSource.getRepository(Project);
  const taskRepo = AppDataSource.getRepository(Task);
  
  await taskRepo.delete({ project: { id: testProject.id } });
  await projectRepo.delete({ id: testProject.id });
  await userRepo.delete({ id: testUser.id });
});

describe('Tasks API', () => {
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'Test task description',
          projectId: testProject.id,
          status: 'pending',
          priority: 'high',
          dueDate: '2025-12-31T23:59:59.000Z'
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe('Test Task');
      expect(response.body.status).toBe('pending');
      expect(response.body.priority).toBe('high');
      expect(response.body.project.id).toBe(testProject.id);

      testTask = response.body;
    });

    it('should not create task without authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Unauthorized Task',
          projectId: testProject.id
        });

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title and projectId'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('GET /api/tasks', () => {
    it('should get list of tasks', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should filter by status', async () => {
      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      response.body.tasks.forEach((task: any) => {
        expect(task.status).toBe('pending');
      });
    });

    it('should filter by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      response.body.tasks.forEach((task: any) => {
        expect(task.priority).toBe('high');
      });
    });

    it('should filter by projectId', async () => {
      const response = await request(app)
        .get(`/api/tasks?projectId=${testProject.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      response.body.tasks.forEach((task: any) => {
        expect(task.project.id).toBe(testProject.id);
      });
    });

    it('should support sorting', async () => {
      const response = await request(app)
        .get('/api/tasks?sortBy=priority&sortOrder=ASC')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should get task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTask.id);
      expect(response.body.title).toBe('Test Task');
    });

    it('should not get non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update task', async () => {
      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Task Title',
          status: 'in-progress',
          priority: 'medium'
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Task Title');
      expect(response.body.status).toBe('in-progress');
      expect(response.body.priority).toBe('medium');
    });

    it('should validate status values', async () => {
      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'invalid-status'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
    });
  });
});

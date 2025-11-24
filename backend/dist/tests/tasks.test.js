"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
let testUser;
let authToken;
let testProject;
let testTask;
beforeAll(async () => {
    // Create test user
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ email: 'task-test@example.com' });
    const registerResponse = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        name: 'Task Test User',
        email: 'task-test@example.com',
        password: 'password123'
    });
    testUser = registerResponse.body.user;
    authToken = registerResponse.body.token;
    // Create test project
    const projectResponse = await (0, supertest_1.default)(app_1.default)
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
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    const projectRepo = database_1.AppDataSource.getRepository(Project_1.Project);
    const taskRepo = database_1.AppDataSource.getRepository(Task_1.Task);
    await taskRepo.delete({ project: { id: testProject.id } });
    await projectRepo.delete({ id: testProject.id });
    await userRepo.delete({ id: testUser.id });
});
describe('Tasks API', () => {
    describe('POST /api/tasks', () => {
        it('should create a new task', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/tasks')
                .send({
                title: 'Unauthorized Task',
                projectId: testProject.id
            });
            expect(response.status).toBe(401);
        });
        it('should validate required fields', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/tasks')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('tasks');
            expect(response.body).toHaveProperty('pagination');
            expect(Array.isArray(response.body.tasks)).toBe(true);
        });
        it('should filter by status', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/tasks?status=pending')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            response.body.tasks.forEach((task) => {
                expect(task.status).toBe('pending');
            });
        });
        it('should filter by priority', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/tasks?priority=high')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            response.body.tasks.forEach((task) => {
                expect(task.priority).toBe('high');
            });
        });
        it('should filter by projectId', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/tasks?projectId=${testProject.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            response.body.tasks.forEach((task) => {
                expect(task.project.id).toBe(testProject.id);
            });
        });
        it('should support sorting', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/tasks?sortBy=priority&sortOrder=ASC')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
        });
    });
    describe('GET /api/tasks/:id', () => {
        it('should get task by id', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get(`/api/tasks/${testTask.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.id).toBe(testTask.id);
            expect(response.body.title).toBe('Test Task');
        });
        it('should not get non-existent task', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/tasks/99999')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(404);
        });
    });
    describe('PUT /api/tasks/:id', () => {
        it('should update task', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/tasks/${testTask.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });
});

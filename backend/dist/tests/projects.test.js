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
let testUser;
let authToken;
let testProject;
beforeAll(async () => {
    // Create test user
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ email: 'project-test@example.com' });
    const registerResponse = await (0, supertest_1.default)(app_1.default)
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
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    const projectRepo = database_1.AppDataSource.getRepository(Project_1.Project);
    await projectRepo.delete({ owner: { id: testUser.id } });
    await userRepo.delete({ id: testUser.id });
});
describe('Projects API', () => {
    describe('POST /api/projects', () => {
        it('should create a new project', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/projects')
                .send({
                name: 'Unauthorized Project',
                description: 'Should fail',
                color: '#000000'
            });
            expect(response.status).toBe(401);
        });
        it('should validate required fields', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/projects')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('projects');
            expect(response.body).toHaveProperty('pagination');
            expect(Array.isArray(response.body.projects)).toBe(true);
            expect(response.body.projects.length).toBeGreaterThan(0);
        });
        it('should support pagination', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/projects?page=1&limit=5')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.pagination.page).toBe(1);
            expect(response.body.pagination.limit).toBe(5);
        });
        it('should support search', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/projects?search=Test')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.projects.length).toBeGreaterThan(0);
        });
    });
    describe('PUT /api/projects/:id', () => {
        it('should update own project', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .delete(`/api/projects/${testProject.id}`)
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('message');
        });
    });
});

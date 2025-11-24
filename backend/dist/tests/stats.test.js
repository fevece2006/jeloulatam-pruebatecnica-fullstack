"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
let testUser;
let authToken;
beforeAll(async () => {
    // Create test user
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ email: 'stats-test@example.com' });
    const registerResponse = await (0, supertest_1.default)(app_1.default)
        .post('/api/auth/register')
        .send({
        name: 'Stats Test User',
        email: 'stats-test@example.com',
        password: 'password123'
    });
    testUser = registerResponse.body.user;
    authToken = registerResponse.body.token;
    // Create a test project and task for stats
    await (0, supertest_1.default)(app_1.default)
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
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ id: testUser.id });
});
describe('Stats API', () => {
    describe('GET /api/stats', () => {
        it('should get user statistics', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
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
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/stats');
            expect(response.status).toBe(401);
        });
        it('should return correct project count', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/stats')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.totalProjects).toBeGreaterThanOrEqual(1);
        });
    });
});

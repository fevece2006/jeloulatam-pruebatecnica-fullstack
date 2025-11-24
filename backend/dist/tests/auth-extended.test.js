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
    // Clean up test data
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ email: 'test@example.com' });
});
afterAll(async () => {
    // Clean up test data
    const userRepo = database_1.AppDataSource.getRepository(User_1.User);
    await userRepo.delete({ email: 'test@example.com' });
});
describe('Auth API', () => {
    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Test User',
                email: 'test@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user).toHaveProperty('id');
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user.name).toBe('Test User');
            expect(response.body.user).not.toHaveProperty('password');
            testUser = response.body.user;
            authToken = response.body.token;
        });
        it('should not register user with duplicate email', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Another User',
                email: 'test@example.com',
                password: 'password456'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('message');
        });
        it('should validate email format', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Invalid Email User',
                email: 'invalid-email',
                password: 'password123'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
        it('should validate password length', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/register')
                .send({
                name: 'Short Password',
                email: 'short@example.com',
                password: '123'
            });
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty('errors');
        });
    });
    describe('POST /api/auth/login', () => {
        it('should login with valid credentials', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('test@example.com');
            expect(response.body.user).not.toHaveProperty('password');
        });
        it('should not login with invalid password', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });
        it('should not login with non-existent email', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .post('/api/auth/login')
                .send({
                email: 'nonexistent@example.com',
                password: 'password123'
            });
            expect(response.status).toBe(401);
            expect(response.body).toHaveProperty('message');
        });
    });
    describe('GET /api/auth/profile', () => {
        it('should get user profile with valid token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${authToken}`);
            expect(response.status).toBe(200);
            expect(response.body.email).toBe('test@example.com');
            expect(response.body).not.toHaveProperty('password');
        });
        it('should not get profile without token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/auth/profile');
            expect(response.status).toBe(401);
        });
        it('should not get profile with invalid token', async () => {
            const response = await (0, supertest_1.default)(app_1.default)
                .get('/api/auth/profile')
                .set('Authorization', 'Bearer invalid-token');
            expect(response.status).toBe(403);
        });
    });
});

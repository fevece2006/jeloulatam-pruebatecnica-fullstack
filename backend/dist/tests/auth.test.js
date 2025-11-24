"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
const database_1 = require("../config/database");
beforeAll(async () => {
    await database_1.AppDataSource.initialize();
});
afterAll(async () => {
    await database_1.AppDataSource.destroy();
});
describe('Auth API', () => {
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
        expect(response.body.user.email).toBe('test@example.com');
    });
    it('should login with valid credentials', async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/api/auth/login')
            .send({
            email: 'test@example.com',
            password: 'password123'
        });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});

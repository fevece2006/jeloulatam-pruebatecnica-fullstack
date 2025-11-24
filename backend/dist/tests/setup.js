"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
beforeAll(async () => {
    // Initialize database connection for tests
    if (!database_1.AppDataSource.isInitialized) {
        await database_1.AppDataSource.initialize();
    }
});
afterAll(async () => {
    // Close database connection after tests
    if (database_1.AppDataSource.isInitialized) {
        await database_1.AppDataSource.destroy();
    }
});
// Increase timeout for database operations
jest.setTimeout(10000);

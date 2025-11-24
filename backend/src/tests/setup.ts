import { AppDataSource } from '../config/database';

beforeAll(async () => {
  // Initialize database connection for tests
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
});

afterAll(async () => {
  // Close database connection after tests
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
});

// Increase timeout for database operations
jest.setTimeout(10000);

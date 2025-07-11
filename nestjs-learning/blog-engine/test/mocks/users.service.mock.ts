/**
 * Mock Users Service for E2E Testing
 * Provides a mock implementation of UsersService to handle import path issues
 */

export const mockUsersService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByEmail: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

/**
 * Factory function to create mock users data
 */
export function createMockUser(overrides = {}) {
  return {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    role: 'user',
    isActive: true,
    avatar: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    fullName: 'Test User',
    ...overrides,
  };
}

/**
 * Reset all mocks to their initial state
 */
export function resetUserServiceMocks() {
  Object.values(mockUsersService).forEach(mock => {
    if (jest.isMockFunction(mock)) {
      mock.mockReset();
    }
  });
} 
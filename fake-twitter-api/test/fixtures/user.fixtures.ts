/**
 * User Fixtures - Reusable test data and expected messages for user e2e tests
 */

export const UserFixtures = {
  expectedSuccessMessages: {
    getProfile: 'User profile retrieved successfully',
    updateProfile: 'Profile updated successfully',
    getStats: 'User statistics retrieved successfully',
    getPosts: 'User posts retrieved successfully',
    getComments: 'User comments retrieved successfully',
    deleteUser: 'User deleted successfully',
  },
  expectedErrorMessages: {
    unauthorized: 'Unauthorized - Invalid credentials',
    forbidden: 'Forbidden - insufficient permissions',
    notFound: 'User not found',
    internal: 'Internal server error',
  },
  sampleUser: {
    email: `user-${Date.now()}@example.com`,
    username: `user${Date.now()}`,
    password: 'TestPass123!',
    firstName: 'Test',
    lastName: 'User',
    bio: 'Test user bio',
  },
};

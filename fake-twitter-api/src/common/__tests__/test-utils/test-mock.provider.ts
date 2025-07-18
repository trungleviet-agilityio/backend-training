/**
 * This class is used to create mock objects for the test suite.
 */

export class TestMockProvider {
  static createMock<T>(type: new (...args: any[]) => T): jest.Mocked<T> {
    return jest.fn() as unknown as jest.Mocked<T>;
  }
}

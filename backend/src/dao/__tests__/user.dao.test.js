import { updateUserRole } from '../user.dao.js';

const mockDeleteCache = jest.fn();
const mockFindByIdAndUpdate = jest.fn();

jest.mock('../../config/redis.js', () => ({
  getCache: jest.fn(),
  setCache: jest.fn(),
  deleteCache: (...args) => mockDeleteCache(...args),
}));

jest.mock('../../models/user.model.js', () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: (...args) => mockFindByIdAndUpdate(...args),
  },
}));

describe('updateUserRole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('updates via findByIdAndUpdate and invalidates the cached user', async () => {
    const liveDoc = { _id: 'u1', role: 'admin' };
    mockFindByIdAndUpdate.mockResolvedValue(liveDoc);

    const result = await updateUserRole('u1', 'admin');

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      'u1',
      { role: 'admin' },
      { returnDocument: 'after' },
    );
    expect(mockDeleteCache).toHaveBeenCalledWith('user:u1');
    expect(result).toBe(liveDoc);
  });

  test('returns null and skips cache invalidation when user does not exist', async () => {
    mockFindByIdAndUpdate.mockResolvedValue(null);

    const result = await updateUserRole('nope', 'user');

    expect(result).toBeNull();
    expect(mockDeleteCache).not.toHaveBeenCalled();
  });
});
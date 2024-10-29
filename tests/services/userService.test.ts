import { getUserByEmail, createUser } from '../../src/services/userService';
import firestore from '../../src/config/firestore';
import { User } from '../../src/models/User';

jest.mock('../../src/config/firestore', () => ({
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn(),
      set: jest.fn(),
    }),
  }),
}));

const mockedFirestore = firestore.collection as jest.Mock;

describe('User Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return a user if the document exists', async () => {
      const email = 'test@example.com';
      const mockUser = { email, name: 'Test User' };

      mockedFirestore().doc().get.mockResolvedValue({
        exists: true,
        data: () => mockUser,
      });

      const user = await getUserByEmail(email);
      expect(mockedFirestore().doc).toHaveBeenCalledWith(email);
      expect(user).toEqual(mockUser);
    });

    it('should return null if the document does not exist', async () => {
      const email = 'notfound@example.com';

      mockedFirestore().doc().get.mockResolvedValue({
        exists: false,
      });

      const user = await getUserByEmail(email);
      expect(mockedFirestore().doc).toHaveBeenCalledWith(email);
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user by calling set with user data', async () => {
      const mockUser: User = { email: 'newuser@example.com', name: 'New User', date:new Date() };

      await createUser(mockUser);
      expect(mockedFirestore().doc).toHaveBeenCalledWith(mockUser.email);
      expect(mockedFirestore().doc().set).toHaveBeenCalledWith(mockUser);
    });
  });
});

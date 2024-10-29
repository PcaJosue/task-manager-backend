import { Request, Response } from 'express';
import * as userService from '../../src/services/userService';
import * as userController from '../../src/controller/userController';
import jwt from 'jsonwebtoken';

// Mock userService and jwt
jest.mock('../../src/services/userService');
jest.mock('jsonwebtoken');

const mockedUserService = userService as jest.Mocked<typeof userService>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;


describe('User Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {
      params: {},
      body: {}
    };
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    res = {
      json: jsonMock,
      status: statusMock
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return user and token if user exists', async () => {
      const user = { email: 'test@example.com', name: 'Test User',date: new Date() };
      const token = 'mockedToken';
      req.params = { email: 'test@example.com' };

      mockedUserService.getUserByEmail.mockResolvedValue(user);
      (mockedJwt.sign as jest.Mock).mockReturnValue(token);

      await userController.getUser(req as Request, res as Response);

      expect(mockedUserService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockedJwt.sign).toHaveBeenCalledWith({ email: 'test@example.com' }, expect.any(String), { expiresIn: '1h' });
      expect(jsonMock).toHaveBeenCalledWith({ user, token });
    });

    it('should return 404 if user does not exist', async () => {
      req.params = { email: 'notfound@example.com' };

      mockedUserService.getUserByEmail.mockResolvedValue(null);

      await userController.getUser(req as Request, res as Response);

      expect(mockedUserService.getUserByEmail).toHaveBeenCalledWith('notfound@example.com');
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User not found' });
    });

  });

  describe('createUser', () => {
    it('should create user and return 201 with token', async () => {
      const userData = { email: 'newuser@example.com', name: 'New User', date: expect.any(Date) };
      const token = 'mockedToken';
      req.body = { email: 'newuser@example.com', name: 'New User' };

      mockedUserService.createUser.mockResolvedValue(undefined);
      (mockedJwt.sign as jest.Mock).mockReturnValue(token);

      await userController.createUser(req as Request, res as Response);

      expect(mockedUserService.createUser).toHaveBeenCalledWith(userData);
      expect(mockedJwt.sign).toHaveBeenCalledWith({ email: 'newuser@example.com' }, expect.any(String), { expiresIn: '1h' });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'User created successfully', token });
    });

    
  });
});

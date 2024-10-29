import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../src/config/authMiddleware';
import jwt from 'jsonwebtoken';

// Mock jsonwebtoken
jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

describe('verifyToken Middleware', () => {
  let req: Partial<Request> = { headers: {}};
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      headers: {} 
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', () => {
    verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if the token is invalid', () => {
    if(req && req.headers) req.headers.authorization = 'Bearer invalid_token';
    mockedJwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });

    verifyToken(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unauthorized: Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if the token is valid', () => {
    if(req && req.headers) req.headers.authorization = 'Bearer valid_token';
    mockedJwt.verify.mockReturnValue({ email: 'test@example.com' } as any);

    verifyToken(req as Request, res as Response, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith('valid_token', process.env.JWT_SECRET || 'default_secret_if_not_defined');
    if(req && req.headers) expect(req.headers.email).toBe('test@example.com');
    expect(next).toHaveBeenCalled();
  });
});

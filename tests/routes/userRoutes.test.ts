import request from 'supertest';
import express, { Request, Response } from 'express';
import userRoutes from '../../src/routes/userRoutes';
import * as userController from '../../src/controller/userController';

jest.mock('../../src/controller/userController');
const mockedUserController = userController as jest.Mocked<typeof userController>;

const app = express();
app.use(express.json());
app.use(userRoutes);

describe('User Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getUser on GET /:email', async () => {
    mockedUserController.getUser.mockImplementation(async (req: Request, res: Response) => {
      res.status(200).json({ message: 'User retrieved' });
      return Promise.resolve();
    });

    const response = await request(app).get('/test@example.com');
    expect(mockedUserController.getUser).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'User retrieved' });
  });

  it('should call createUser on POST /', async () => {
    mockedUserController.createUser.mockImplementation(async (req: Request, res: Response) => {
      res.status(201).json({ message: 'User created' });
      return Promise.resolve();
    });

    const response = await request(app).post('/').send({ email: 'newuser@example.com', name: 'New User' });
    expect(mockedUserController.createUser).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'User created' });
  });
});

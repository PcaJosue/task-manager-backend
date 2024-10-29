import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import taskRoutes from '../../src/routes/taskRoutes';
import * as taskController from '../../src/controller/taskController';
import { verifyToken } from '../../src/config/authMiddleware';

jest.mock('../../src/controller/taskController');
const mockedTaskController = taskController as jest.Mocked<typeof taskController>;

jest.mock('../../src/config/authMiddleware');
const mockedVerifyToken = verifyToken as jest.Mock;

const app = express();
app.use(express.json());
app.use(taskRoutes);

mockedVerifyToken.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getTasks on GET /', async () => {
    mockedTaskController.getTasks.mockImplementation(async (req: Request, res: Response) => {
      res.status(200).json({ message: 'Tasks retrieved' });
      return Promise.resolve();
    });
    const response = await request(app).get('/');
    expect(mockedVerifyToken).toHaveBeenCalled();
    expect(mockedTaskController.getTasks).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Tasks retrieved' });
  });

  it('should call addTask on POST /', async () => {
    mockedTaskController.addTask.mockImplementation(async (req: Request, res: Response) => {
      res.status(201).json({ message: 'Task added' });
      return Promise.resolve();
    });
    const response = await request(app).post('/').send({ title: 'New Task' });
    expect(mockedVerifyToken).toHaveBeenCalled();
    expect(mockedTaskController.addTask).toHaveBeenCalled();
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: 'Task added' });
  });

  it('should call updateTask on PUT /:taskId', async () => {
    mockedTaskController.updateTask.mockImplementation(async (req: Request, res: Response) => {
      res.status(200).json({ message: 'Task updated' });
      return Promise.resolve();
    });
    const response = await request(app).put('/123').send({ title: 'Updated Task' });
    expect(mockedVerifyToken).toHaveBeenCalled();
    expect(mockedTaskController.updateTask).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task updated' });
  });

  it('should call deleteTask on DELETE /:taskId', async () => {
    mockedTaskController.deleteTask.mockImplementation(async (req: Request, res: Response) => {
      res.status(200).json({ message: 'Task deleted' });
      return Promise.resolve();
    });
    const response = await request(app).delete('/123');
    expect(mockedVerifyToken).toHaveBeenCalled();
    expect(mockedTaskController.deleteTask).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Task deleted' });
  });
});

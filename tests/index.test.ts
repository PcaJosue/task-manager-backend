import request, { Request, Response } from 'supertest';
import app from '../src/index';
import { NextFunction } from 'express';

jest.mock('../src/config/authMiddleware', () => ({
  verifyToken: (req: Request, res:Response, next: NextFunction) => next(),
}));

jest.mock('../src/controller/taskController', () => ({
  ...jest.requireActual('../src/controller/taskController'),
  getTasks: jest.fn((req, res) => res.status(200).json({ message: 'Tasks retrieved successfully' })),
}));

describe('App Integration Tests', () => {
  it('should respond with 200 on the root API route', async () => {
    const response = await request(app).get('/api/tasks')// Assuming /api/tasks is a valid route
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Tasks retrieved successfully' });
  });

  it('should allow CORS from specified origin', async () => {
    const response = await request(app)
      .options('/api/tasks')
      .set('Origin', 'http://localhost:4200');
    
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    expect(response.headers['access-control-allow-methods']).toBe('GET,POST,PUT,DELETE');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should handle 404 for unknown routes', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toBe(404);
  });
});

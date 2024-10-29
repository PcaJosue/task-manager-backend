import { Request, Response } from 'express';
import * as taskService from '../../src/services/taskService';
import { getTasks, addTask, updateTask, deleteTask } from '../../src/controller/taskController';

// Mock taskService methods
jest.mock('../../src/services/taskService');
const mockedTaskService = taskService as jest.Mocked<typeof taskService>;

describe('Task Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    req = {
      headers: { email: 'test@example.com' }
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

  describe('getTasks', () => {
    it('should return tasks on success', async () => {
        const tasks = [
          {
            id: '1',
            title: 'Test Task',
            description: 'This is a test task',
            createdAt: new Date(),
            completed: false,
            userEmail: 'test@test.com'
          }
        ];
    
        mockedTaskService.getAllTasks.mockResolvedValue(tasks);
    
        await getTasks(req as Request, res as Response);
    
        expect(mockedTaskService.getAllTasks).toHaveBeenCalledWith('test@example.com');
        expect(jsonMock).toHaveBeenCalledWith(tasks);
      });

    it('should return 500 on error', async () => {
      mockedTaskService.getAllTasks.mockRejectedValue(new Error('Error retrieving tasks'));

      await getTasks(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Error retrieving tasks' });
    });
  });

  describe('addTask', () => {
    it('should return 201 and taskId on success', async () => {
      req.body = { title: 'New Task' };
      const taskId = 'newTaskId';
      mockedTaskService.addTask.mockResolvedValue(taskId);

      await addTask(req as Request, res as Response);

      expect(mockedTaskService.addTask).toHaveBeenCalledWith(req.body, 'test@example.com');
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Task created successfully', taskId });
    });

    it('should return 500 on error', async () => {
      req.body = { title: 'New Task' };
      mockedTaskService.addTask.mockRejectedValue(new Error('Error creating task'));

      await addTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Error creating task' });
    });
  });

  describe('updateTask', () => {
    it('should return success message on update', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };
      mockedTaskService.updateTask.mockResolvedValue();

      await updateTask(req as Request, res as Response);

      expect(mockedTaskService.updateTask).toHaveBeenCalledWith('1', req.body, 'test@example.com');
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Task updated successfully' });
    });

    it('should return 500 on error', async () => {
      req.params = { taskId: '1' };
      req.body = { title: 'Updated Task' };
      mockedTaskService.updateTask.mockRejectedValue(new Error('Error updating task'));

      await updateTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Error updating task' });
    });
  });

  describe('deleteTask', () => {
    it('should return success message on delete', async () => {
      req.params = { taskId: '1' };
      mockedTaskService.deleteTask.mockResolvedValue();

      await deleteTask(req as Request, res as Response);

      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith('1', 'test@example.com');
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 500 on error', async () => {
      req.params = { taskId: '1' };
      mockedTaskService.deleteTask.mockRejectedValue(new Error('Error deleting task'));

      await deleteTask(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: 'Error deleting task' });
    });
  });
});

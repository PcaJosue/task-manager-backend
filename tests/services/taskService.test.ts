import { getAllTasks, addTask, updateTask, deleteTask } from '../../src/services/taskService';
import firestore from '../../src/config/firestore';
import { Task } from '../../src/models/Task';

jest.mock('../../src/config/firestore', () => ({
  collection: jest.fn().mockReturnValue({
    doc: jest.fn().mockReturnValue({
      get: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }),
    where: jest.fn().mockReturnValue({
      get: jest.fn(),
    }),
    add: jest.fn(),
  }),
}));

const mockedFirestore = firestore.collection as jest.Mock;

describe('Task Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllTasks', () => {
    it('should return tasks for a specific user', async () => {
      const userEmail = 'test@example.com';
      const mockTasks = [
        { id: '1', title: 'Test Task 1', description: 'Description 1', userEmail },
        { id: '2', title: 'Test Task 2', description: 'Description 2', userEmail },
      ];

      mockedFirestore().where().get.mockResolvedValue({
        docs: mockTasks.map((task) => ({
          id: task.id,
          data: () => task,
        })),
      });

      const tasks = await getAllTasks(userEmail);
      expect(mockedFirestore).toHaveBeenCalledWith('tasks');
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('addTask', () => {
    it('should add a task and return the document ID', async () => {
      const userEmail = 'test@example.com';
      const task: Task = { id: '1', title: 'New Task', description: 'New Description', userEmail,createdAt: new Date(), completed: false };
      const mockDocRef = { id: 'newTaskId' };

      mockedFirestore().add.mockResolvedValue(mockDocRef);

      const taskId = await addTask(task, userEmail);
      expect(taskId).toBe(mockDocRef.id);
    });
  });

  describe('updateTask', () => {
    it('should update a task if it exists and belongs to the user', async () => {
      const taskId = 'taskId';
      const userEmail = 'test@example.com';
      const updateData = { title: 'Updated Title' };

      mockedFirestore().doc().get.mockResolvedValue({
        exists: true,
        data: () => ({ userEmail }),
      });

      await updateTask(taskId, updateData, userEmail);
      expect(mockedFirestore().doc).toHaveBeenCalledWith(taskId);
      expect(mockedFirestore().doc().update).toHaveBeenCalledWith(updateData);
    });

    it('should throw an error if the task does not exist or belongs to another user', async () => {
      const taskId = 'taskId';
      const userEmail = 'test@example.com';
      const updateData = { title: 'Updated Title' };

      mockedFirestore().doc().get.mockResolvedValue({
        exists: false,
        data: () => undefined,
      });

      await expect(updateTask(taskId, updateData, userEmail)).rejects.toThrow('Task not found or unauthorized');
    });
  });

  describe('deleteTask', () => {
    it('should delete a task if it exists and belongs to the user', async () => {
      const taskId = 'taskId';
      const userEmail = 'test@example.com';

      mockedFirestore().doc().get.mockResolvedValue({
        exists: true,
        data: () => ({ userEmail }),
      });

      await deleteTask(taskId, userEmail);
      expect(mockedFirestore().doc).toHaveBeenCalledWith(taskId);
      expect(mockedFirestore().doc().delete).toHaveBeenCalled();
    });

    it('should throw an error if the task does not exist or belongs to another user', async () => {
      const taskId = 'taskId';
      const userEmail = 'test@example.com';

      mockedFirestore().doc().get.mockResolvedValue({
        exists: false,
        data: () => undefined,
      });

      await expect(deleteTask(taskId, userEmail)).rejects.toThrow('Task not found or unauthorized');
    });
  });
});

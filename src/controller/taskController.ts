import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

export const getTasks = async (req: Request, res: Response) => {
  try {
      const userEmail = req.headers.email as string;
      const tasks = await taskService.getAllTasks(userEmail);
      res.json(tasks);
  } catch (error) {
      res.status(500).json({ message: 'Error retrieving tasks' });
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
      const task = req.body;
      const userEmail = req.headers.email as string;
      const taskId = await taskService.addTask(task, userEmail);
      res.status(201).json({ message: 'Task created successfully', taskId });
  } catch (error) {
      res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
      const { taskId } = req.params;
      const task = req.body;
      const userEmail = req.headers.email as string;

      await taskService.updateTask(taskId, task, userEmail);
      res.json({ message: 'Task updated successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  try {
      const { taskId } = req.params;
      const userEmail = req.headers.email as string;

      await taskService.deleteTask(taskId, userEmail);
      res.json({ message: 'Task deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Error deleting task' });
  }
};

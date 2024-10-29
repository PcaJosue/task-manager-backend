import firestore from '../config/firestore';
import { Task } from '../models/Task';


const tasksCollection = firestore.collection('tasks');

export const getAllTasks = async (userEmail: string): Promise<Task[]> => {
  const snapshot = await tasksCollection.where('userEmail', '==', userEmail).get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Task));
};

export const addTask = async (task: Task, userEmail: string): Promise<string> => {
  const docRef = await tasksCollection.add({
      ...task,
      userEmail,
      createdAt: new Date().getTime(),
  });
  return docRef.id;
};

export const updateTask = async (taskId: string, task: Partial<Task>, userEmail: string): Promise<void> => {
  const taskDoc = tasksCollection.doc(taskId);
  const doc = await taskDoc.get();

  if (!doc.exists || doc.data()?.userEmail !== userEmail) {
      throw new Error('Task not found or unauthorized');
  }

  await taskDoc.update(task);
};

export const deleteTask = async (taskId: string, userEmail: string): Promise<void> => {
  const taskDoc = tasksCollection.doc(taskId);
  const doc = await taskDoc.get();

  if (!doc.exists || doc.data()?.userEmail !== userEmail) {
      throw new Error('Task not found or unauthorized');
  }

  await taskDoc.delete();
};

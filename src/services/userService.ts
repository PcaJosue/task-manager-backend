import firestore from '../config/firestore';
import { User } from '../models/User';

const usersCollection = firestore.collection('users');

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const doc = await usersCollection.doc(email).get();
  return doc.exists ? (doc.data() as User) : null;
};

export const createUser = async (user: User): Promise<void> => {
  await usersCollection.doc(user.email).set(user);
};

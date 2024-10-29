import { Request, Response } from 'express';
import * as userService from '../services/userService';
import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'default_secret_if_not_defined';

export const getUser = async (req: Request, res: Response) => {
  const user = await userService.getUserByEmail(req.params.email);
  if (user) {
    const token = jwt.sign({ email: user.email },secret , { expiresIn: '1h' });
    res.json({user,token});
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  const { email, name } = req.body;
  const date = new Date();
  await userService.createUser({ email, name, date });
  const token = jwt.sign({ email }, secret, { expiresIn: '1h' });

  res.status(201).json({ message: 'User created successfully', token });
};

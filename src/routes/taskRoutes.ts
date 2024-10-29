import { Router } from 'express';
import * as taskController from '../controller/taskController';
import { verifyToken } from '../config/authMiddleware';

const router = Router();
router.use(verifyToken);
router.get('/', taskController.getTasks);
router.post('/', taskController.addTask);
router.put('/:taskId', taskController.updateTask);
router.delete('/:taskId', taskController.deleteTask);

export default router;

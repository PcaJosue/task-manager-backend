import { Router } from 'express';
import * as userController from '../controller/userController';

const router = Router();

router.get('/:email', userController.getUser);
router.post('/', userController.createUser);

export default router;

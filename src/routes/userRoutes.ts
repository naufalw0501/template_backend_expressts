import express from 'express';
import * as userController from '../controllers/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, userController.getAllUsers);
router.post('/add', authenticateToken, userController.addUser);
router.put('/update', authenticateToken, userController.updateUser);
router.delete('/delete', authenticateToken, userController.deleteUser);

export default router;

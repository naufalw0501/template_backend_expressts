import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/', userController.getAllUsers);
router.post('/add', userController.addUser);
router.put('/update', userController.updateUser);
router.delete('/delete', userController.deleteUser);

export default router;

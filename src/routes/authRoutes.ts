import express from 'express';
import { loginController, refreshToken, changePassword  } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/login', loginController);
router.post('/refresh', refreshToken);
router.post('/change_password', authenticateToken, changePassword);

export default router;

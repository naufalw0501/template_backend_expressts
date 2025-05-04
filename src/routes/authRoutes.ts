import express from 'express';
import { loginController, refreshToken, changePassword  } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import loginLimiter from '../middlewares/rateLimiter';

const router = express.Router();

router.post('/login', loginLimiter, loginController);
router.post('/refresh', refreshToken);
router.post('/change_password', authenticateToken, changePassword);

export default router;

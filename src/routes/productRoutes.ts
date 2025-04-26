import express from 'express';
import * as productController from '../controllers/productController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, productController.getAllProducts);
router.get('/categories', authenticateToken, productController.getAllCategories);
router.post('/add', authenticateToken, productController.addProduct);
router.put('/update', authenticateToken, productController.updateProduct);
router.delete('/delete', authenticateToken, productController.deleteProduct);

export default router;

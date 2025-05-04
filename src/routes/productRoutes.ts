import express from 'express';
import * as productController from '../controllers/productController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { uploadProductImage } from '../middlewares/uploadFileMiddleware';
const router = express.Router();

router.get('/', authenticateToken, productController.getAllProducts);
router.get('/categories', authenticateToken, productController.getAllCategories);
router.post('/add', authenticateToken, uploadProductImage.single('image'), productController.addProduct);
router.put('/update', authenticateToken, uploadProductImage.single('image'), productController.updateProduct);
router.delete('/delete', authenticateToken, productController.deleteProduct);

export default router;

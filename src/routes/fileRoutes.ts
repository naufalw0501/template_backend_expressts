import express from 'express';
import { getImage } from '../controllers/fileController';

const router = express.Router();

router.get('/:image_category/:filename', getImage);

export default router;

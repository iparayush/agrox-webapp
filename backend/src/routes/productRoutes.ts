import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.post('/', authenticateToken, requireRole(['FARMER', 'ADMIN']), createProduct);

export default router;

import { Router } from 'express';
import { createOrder, updateOrderStatus, getOrders } from '../controllers/orderController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken);

router.get('/', getOrders);
router.post('/', createOrder);
router.patch('/:id/status', updateOrderStatus);

export default router;

import { Router } from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import orderRoutes from './orderRoutes.js';
import farmerRoutes from './farmerRoutes.js';
import adminRoutes from './adminRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import cartRoutes from './cartRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/farmer', farmerRoutes);
router.use('/admin', adminRoutes);
router.use('/categories', categoryRoutes);
router.use('/cart', cartRoutes);
router.use('/notifications', notificationRoutes);

export default router;

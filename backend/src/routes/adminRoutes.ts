import { Router } from 'express';
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserStatus,
  getAdminFarmers,
  verifyFarmer,
  getAdminProducts,
  updateProductStatus,
  getAdminOrders,
  updateOrderStatus,
  getAdminPayments,
} from '../controllers/adminController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken, requireRole(['ADMIN', 'SUPER_ADMIN']));

// Dashboard metrics
router.get('/dashboard', getAdminDashboard);

// User Directory
router.get('/users', getAdminUsers);
router.patch('/users/:id/status', updateUserStatus);

// Farmer Approvals
router.get('/farmers', getAdminFarmers);
router.patch('/farmers/:id/verify', verifyFarmer);

// Product Moderation
router.get('/products', getAdminProducts);
router.patch('/products/:id/status', updateProductStatus);

// Order Management
router.get('/orders', getAdminOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Payments & Ledger
router.get('/payments', getAdminPayments);

export default router;

import { Router } from 'express';
import { getFarmerDashboard, getFarmerEarnings } from '../controllers/farmerController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticateToken, requireRole(['FARMER', 'ADMIN']));

router.get('/dashboard', getFarmerDashboard);
router.get('/earnings', getFarmerEarnings);

export default router;

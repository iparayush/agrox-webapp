import { Router, Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

// POST /auth/register
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, message: 'Registration successful', data: result });
  } catch (err) { next(err); }
});

// POST /auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { emailOrPhone, password } = req.body;
    const result = await authService.login(emailOrPhone, password);
    res.status(200).json({ success: true, message: 'Authentication successful', data: result });
  } catch (err) { next(err); }
});

// GET /auth/profile — get own profile
router.get('/profile', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const profile = await authService.getProfile(userId);
    res.json({ success: true, data: profile });
  } catch (err) { next(err); }
});

// PATCH /auth/profile — update own profile
router.patch('/profile', authenticateToken, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const updated = await authService.updateProfile(userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) { next(err); }
});

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { notificationRepository } from '../repositories/NotificationRepository.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authenticateToken);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const unreadOnly = req.query.unread_only === 'true';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const result = await notificationRepository.list(userId, unreadOnly, page, limit);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
});

router.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const notifId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await notificationRepository.markRead(notifId, userId);
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (err) { next(err); }
});

router.patch('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    await notificationRepository.markAllRead(userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) { next(err); }
});

export default router;

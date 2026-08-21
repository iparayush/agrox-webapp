import { Router, Request, Response, NextFunction } from 'express';
import { cartRepository } from '../repositories/CartRepository.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authenticateToken);

// GET /cart
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const cart = await cartRepository.getCart(userId);
    res.json({ success: true, data: cart });
  } catch (err) { next(err); }
});

// POST /cart — add item
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const { product_id, quantity } = req.body;
    const item = await cartRepository.addItem(userId, product_id, quantity);
    res.status(201).json({ success: true, data: item });
  } catch (err) { next(err); }
});

// PATCH /cart/:id — update quantity
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { quantity } = req.body;
    const item = await cartRepository.updateItem(userId, itemId, quantity);
    res.json({ success: true, data: item });
  } catch (err) { next(err); }
});

// DELETE /cart/:id — remove item
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    const itemId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await cartRepository.removeItem(userId, itemId);
    res.json({ success: true, message: 'Item removed from cart' });
  } catch (err) { next(err); }
});

// DELETE /cart — clear all
router.delete('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.id || 'usr-101';
    await cartRepository.clearCart(userId);
    res.json({ success: true, message: 'Cart cleared' });
  } catch (err) { next(err); }
});

export default router;

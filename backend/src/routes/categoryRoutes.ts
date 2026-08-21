import { Router, Request, Response } from 'express';
import { categoryRepository } from '../repositories/CategoryRepository.js';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  const categories = await categoryRepository.getAll();
  res.json({ success: true, data: categories });
});

router.post('/', async (req: Request, res: Response) => {
  const cat = await categoryRepository.create(req.body);
  res.status(201).json({ success: true, data: cat });
});

export default router;

import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/productService.js';
import { CreateProductSchema } from '../validators/schemas.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.getProducts(req.query);
    res.status(200).json({
      success: true,
      data: products,
      pagination: { page: 1, limit: 20, total: products.length },
    });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = CreateProductSchema.parse(req.body);
    const farmerId = req.user?.id || 'farmer-1';
    const newProduct = await productService.createProduct(farmerId, validatedData);
    res.status(201).json({
      success: true,
      message: 'Product listed successfully',
      data: newProduct,
    });
  } catch (err) {
    next(err);
  }
};

import { Response, NextFunction } from 'express';
import { orderService } from '../services/orderService.js';
import { CheckoutOrderSchema, UpdateOrderStatusSchema } from '../validators/schemas.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const createOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const validatedData = CheckoutOrderSchema.parse(req.body);
    const customerId = req.user?.id || 'cust-101';
    const order = await orderService.createOrder(customerId, validatedData);
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const validatedData = UpdateOrderStatusSchema.parse(req.body);
    const userId = req.user?.id || 'admin-1';
    const updated = await orderService.updateOrderStatus(orderId, validatedData.status, userId);
    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};


export const getOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id || 'cust-101';
    const role = req.user?.role || 'CUSTOMER';
    const orders = await orderService.getOrders(userId, role);
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (err) {
    next(err);
  }
};

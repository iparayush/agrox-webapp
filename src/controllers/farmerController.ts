import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export const getFarmerDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        todaySales: 4280,
        totalOrders: 18,
        pendingOrders: 5,
        totalStockKg: 1250,
        currency: 'INR',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getFarmerEarnings = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        totalEarnings: 125400,
        period: 'Monthly',
        settlements: [
          { id: 'SET-9912', amount: 14280, date: '2026-08-20', status: 'PAID', bankRef: 'SBI-UTR99281726' },
          { id: 'SET-9904', amount: 22100, date: '2026-08-15', status: 'PAID', bankRef: 'SBI-UTR88371625' },
        ],
      },
    });
  } catch (err) {
    next(err);
  }
};

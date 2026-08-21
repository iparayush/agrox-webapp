import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService.js';
import { RegisterSchema, LoginSchema } from '../validators/schemas.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = RegisterSchema.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = LoginSchema.parse(req.body);
    const result = await authService.login(validatedData.emailOrPhone, validatedData.password);
    res.status(200).json({
      success: true,
      message: 'Authentication successful',
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

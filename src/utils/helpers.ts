/**
 * Generates an AGROX order number: AGX-YYYYMMDD-XXXXXX
 * XXXXXX is a random 6-digit suffix (production would use a DB sequence)
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const seq = Math.floor(100000 + Math.random() * 900000);
  return `AGX-${date}-${seq}`;
}

/**
 * Calculates farmer earnings for an order line.
 * BR-005: platform_charge = 5% of gross_amount, net_amount = gross - platform
 */
export function calculateEarnings(grossAmount: number): {
  gross_amount: number;
  platform_charge: number;
  net_amount: number;
} {
  const platform_charge = parseFloat((grossAmount * 0.05).toFixed(2));
  const net_amount = parseFloat((grossAmount - platform_charge).toFixed(2));
  return { gross_amount: grossAmount, platform_charge, net_amount };
}

/**
 * Build a paginated response shape consistent across all list endpoints
 */
export function paginate<T>(
  items: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
}

/**
 * Parse page/limit from query string with safe defaults
 */
export function parsePagination(query: Record<string, any>): {
  page: number;
  limit: number;
  offset: number;
} {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string) || 20));
  return { page, limit, offset: (page - 1) * limit };
}

/**
 * Standard success response envelope
 */
export function successResponse(data: unknown, message = 'Success', extra?: Record<string, unknown>) {
  return { success: true, message, data, ...extra };
}

/**
 * Create a typed AppError with statusCode and error code
 */
export class AppError extends Error {
  statusCode: number;
  code: string;
  errors?: unknown[];

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const notFound = (resource: string) =>
  new AppError(`${resource} not found`, 404, 'NOT_FOUND');

export const forbidden = (msg = 'Access denied') =>
  new AppError(msg, 403, 'FORBIDDEN');

export const badRequest = (msg: string, errors?: unknown[]) =>
  new AppError(msg, 400, 'BAD_REQUEST', errors);

export const conflict = (msg: string) =>
  new AppError(msg, 409, 'CONFLICT');

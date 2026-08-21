import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const corsRaw = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || '*';

export const env = {
  PORT: process.env.PORT || '4000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  SUPABASE_URL: process.env.SUPABASE_URL || 'https://mock-agrox.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock_key',
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || 'mock_key',
  JWT_SECRET: process.env.JWT_SECRET || 'agrox_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CORS_ORIGIN: corsRaw === '*' ? '*' : corsRaw.split(',').map((s) => s.trim()),
};

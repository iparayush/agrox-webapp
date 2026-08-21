import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export const isRealSupabase = Boolean(
  env.SUPABASE_URL &&
    env.SUPABASE_SERVICE_ROLE_KEY &&
    !env.SUPABASE_URL.includes('mock-agrox')
);

export const supabaseAdmin = isRealSupabase
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

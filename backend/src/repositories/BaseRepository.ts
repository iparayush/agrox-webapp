/**
 * Base repository — thin wrapper around Supabase for a given table.
 * Provides consistent query patterns used by all entity repositories.
 */
import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

export class BaseRepository<T> {
  protected table: string;

  constructor(table: string) {
    this.table = table;
  }

  protected get client() {
    if (!isRealSupabase || !supabaseAdmin) return null;
    return supabaseAdmin.from(this.table);
  }

  async findById(id: string, select = '*'): Promise<T | null> {
    if (!this.client) return null;
    const { data, error } = await this.client.select(select).eq('id', id).single();
    if (error) return null;
    return data as T;
  }

  async findAll(
    filters: Record<string, unknown> = {},
    select = '*',
    order: { column: string; ascending: boolean } = { column: 'created_at', ascending: false }
  ): Promise<T[]> {
    if (!this.client) return [];
    let query = this.client.select(select).order(order.column, { ascending: order.ascending });
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        query = (query as any).eq(key, value);
      }
    }
    const { data, error } = await query;
    if (error) throw new AppError(error.message, 500, 'DB_ERROR');
    return (data || []) as T[];
  }

  async create(payload: Partial<T>): Promise<T> {
    if (!this.client) throw new AppError('Database not configured', 503, 'DB_NOT_CONFIGURED');
    const { data, error } = await this.client.insert(payload as any).select().single();
    if (error) throw new AppError(error.message, 500, 'DB_ERROR');
    return data as T;
  }

  async update(id: string, payload: Partial<T>): Promise<T> {
    if (!this.client) throw new AppError('Database not configured', 503, 'DB_NOT_CONFIGURED');
    const { data, error } = await this.client
      .update({ ...payload, updated_at: new Date().toISOString() } as any)
      .eq('id', id)
      .select()
      .single();
    if (error) throw new AppError(error.message, 500, 'DB_ERROR');
    return data as T;
  }

  async delete(id: string): Promise<void> {
    if (!this.client) return;
    const { error } = await this.client.delete().eq('id', id);
    if (error) throw new AppError(error.message, 500, 'DB_ERROR');
  }

  async count(filters: Record<string, unknown> = {}): Promise<number> {
    if (!this.client) return 0;
    let query = (this.client as any).select('*', { count: 'exact', head: true });
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined) query = query.eq(key, value);
    }
    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  }
}

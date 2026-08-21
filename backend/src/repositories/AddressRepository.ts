import { supabaseAdmin, isRealSupabase } from '../config/database.js';
import { AppError } from '../utils/helpers.js';

export interface Address {
  id: string;
  user_id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  district?: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

const MOCK_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    user_id: 'usr-101',
    label: 'HOME',
    full_name: 'Ayushi Par',
    phone: '+91 98234 56789',
    address_line_1: '12, Gangapur Road',
    city: 'Nashik',
    state: 'Maharashtra',
    pincode: '422013',
    is_default: true,
  },
];

export class AddressRepository {
  async listByUser(userId: string): Promise<Address[]> {
    if (isRealSupabase && supabaseAdmin) {
      const { data } = await supabaseAdmin.from('addresses').select('*').eq('user_id', userId).order('is_default', { ascending: false });
      return data || [];
    }
    return MOCK_ADDRESSES.filter((a) => a.user_id === userId);
  }

  async create(userId: string, payload: Omit<Address, 'id' | 'user_id'>): Promise<Address> {
    if (isRealSupabase && supabaseAdmin) {
      if (payload.is_default) {
        await supabaseAdmin.from('addresses').update({ is_default: false }).eq('user_id', userId);
      }
      const { data, error } = await supabaseAdmin
        .from('addresses')
        .insert({ ...payload, user_id: userId })
        .select()
        .single();
      if (error) throw new AppError(error.message, 500, 'DB_ERROR');
      return data as Address;
    }
    const newAddr: Address = { id: `addr-${Date.now()}`, user_id: userId, ...payload };
    MOCK_ADDRESSES.push(newAddr);
    return newAddr;
  }

  async update(id: string, userId: string, payload: Partial<Address>): Promise<Address> {
    if (isRealSupabase && supabaseAdmin) {
      if (payload.is_default) {
        await supabaseAdmin.from('addresses').update({ is_default: false }).eq('user_id', userId);
      }
      const { data, error } = await supabaseAdmin.from('addresses').update(payload).eq('id', id).eq('user_id', userId).select().single();
      if (error || !data) throw new AppError('Address not found', 404, 'NOT_FOUND');
      return data as Address;
    }
    const addr = MOCK_ADDRESSES.find((a) => a.id === id);
    if (!addr) throw new AppError('Address not found', 404, 'NOT_FOUND');
    Object.assign(addr, payload);
    return addr;
  }

  async delete(id: string, userId: string): Promise<void> {
    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('addresses').delete().eq('id', id).eq('user_id', userId);
    }
  }
}

export const addressRepository = new AddressRepository();

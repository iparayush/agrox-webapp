import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { supabaseAdmin, isRealSupabase } from '../config/database.js';

export const getAdminDashboard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let totalCustomers = 14280;
    let activeFarmers = 183;
    let listedProducts = 420;
    let totalOrders = 1240;
    let grossGMV = 342800;
    let pendingVerifications = 3;

    if (isRealSupabase && supabaseAdmin) {
      try {
        const [
          { count: custCount },
          { count: farmerCount },
          { count: prodCount },
          { count: orderCount },
          { data: ordersData },
          { count: pendingCount },
        ] = await Promise.all([
          supabaseAdmin.from('customers').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('farmers').select('*', { count: 'exact', head: true }).eq('verification_status', 'APPROVED'),
          supabaseAdmin.from('products').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
          supabaseAdmin.from('orders').select('total_amount'),
          supabaseAdmin.from('farmers').select('*', { count: 'exact', head: true }).eq('verification_status', 'PENDING'),
        ]);

        if (custCount !== null && custCount !== undefined) totalCustomers = custCount;
        if (farmerCount !== null && farmerCount !== undefined) activeFarmers = farmerCount;
        if (prodCount !== null && prodCount !== undefined) listedProducts = prodCount;
        if (orderCount !== null && orderCount !== undefined) totalOrders = orderCount;
        if (pendingCount !== null && pendingCount !== undefined) pendingVerifications = pendingCount;
        if (ordersData && ordersData.length > 0) {
          grossGMV = ordersData.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
        }
      } catch (dbErr) {
        console.warn('[AdminController] Live count query warning:', dbErr);
      }
    }

    res.status(200).json({
      success: true,
      data: {
        totalCustomers,
        activeFarmers,
        listedProducts,
        totalOrders,
        grossGMV,
        pendingVerifications,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const roleFilter = req.query.role as string;
    let users = [
      { id: '11111111-1111-4111-a111-111111111111', name: 'Ayushi Par', email: 'customer@agrox.com', phone: '+91 98234 56789', role: 'CUSTOMER', status: 'ACTIVE', joined: '2026-01-12' },
      { id: '22222222-2222-4222-a222-222222222222', name: 'Ramesh Patil', email: 'farmer@agrox.com', phone: '+91 98765 43210', role: 'FARMER', status: 'ACTIVE', joined: '2026-02-10' },
      { id: '33333333-3333-4333-a333-333333333333', name: 'System Administrator', email: 'admin@agrox.com', phone: '+91 99999 00000', role: 'ADMIN', status: 'ACTIVE', joined: '2026-01-01' },
    ];

    if (isRealSupabase && supabaseAdmin) {
      try {
        let query = supabaseAdmin.from('profiles').select('id, full_name, email, phone, role, status, created_at').order('created_at', { ascending: false });
        if (roleFilter) {
          query = query.eq('role', roleFilter.toUpperCase());
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          users = data.map((u) => ({
            id: u.id,
            name: u.full_name,
            email: u.email,
            phone: u.phone || 'N/A',
            role: u.role,
            status: u.status,
            joined: new Date(u.created_at).toISOString().split('T')[0],
          }));
        }
      } catch (err) {
        console.warn('[AdminController] Fetch users warning:', err);
      }
    }

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const newStatus = status === 'BLOCKED' ? 'BLOCKED' : 'ACTIVE';

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('profiles').update({ status: newStatus }).eq('id', userId);
    }

    res.status(200).json({
      success: true,
      message: `User status updated to ${newStatus}`,
      data: { id: userId, status: newStatus },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminFarmers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let farmers = [
      {
        id: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa',
        profile_id: '22222222-2222-4222-a222-222222222222',
        name: 'Ramesh Patil',
        farm_name: 'Patil Organic Farms',
        farm_size_acres: 8.5,
        district: 'Nashik',
        village: 'Dindori',
        rating: 4.9,
        is_verified: true,
        verification_status: 'APPROVED',
        photo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
      },
    ];

    if (isRealSupabase && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('farmers')
          .select('id, profile_id, farm_name, farm_size, village, district, rating, verification_status, profiles(full_name, avatar_url, phone)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          farmers = data.map((f: any) => ({
            id: f.id,
            profile_id: f.profile_id,
            name: f.profiles?.full_name || f.farm_name || 'Farmer Partner',
            farm_name: f.farm_name || 'Organic Farm',
            farm_size_acres: Number(f.farm_size) || 5,
            district: f.district || 'Nashik',
            village: f.village || 'Dindori',
            rating: Number(f.rating) || 5.0,
            is_verified: f.verification_status === 'APPROVED',
            verification_status: f.verification_status,
            photo_url: f.profiles?.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200',
          }));
        }
      } catch (err) {
        console.warn('[AdminController] Fetch farmers warning:', err);
      }
    }

    res.status(200).json({ success: true, data: farmers });
  } catch (err) {
    next(err);
  }
};

export const verifyFarmer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const farmerId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const verificationStatus = status || 'APPROVED';

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('farmers').update({ verification_status: verificationStatus }).eq('id', farmerId);
    }

    res.status(200).json({
      success: true,
      message: `Farmer verification updated to ${verificationStatus}`,
      data: { id: farmerId, verification_status: verificationStatus },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminProducts = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    let products = [
      {
        id: 'ba111111-1111-4111-a111-111111111111',
        name: 'Organic Hybrid Tomatoes',
        variety: 'Vaishali Hybrid',
        category: 'Vegetables',
        farmer_name: 'Patil Organic Farms',
        price_per_unit: 38,
        unit: 'kg',
        available_quantity_kg: 250,
        is_approved: true,
        status: 'ACTIVE',
        image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400',
      },
      {
        id: 'ba222222-2222-4222-a222-222222222222',
        name: 'Nashik Red Onions',
        variety: 'Garwa Red',
        category: 'Vegetables',
        farmer_name: 'Patil Organic Farms',
        price_per_unit: 28,
        unit: 'kg',
        available_quantity_kg: 500,
        is_approved: true,
        status: 'ACTIVE',
        image_url: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=400',
      },
      {
        id: 'ba333333-3333-4333-a333-333333333333',
        name: 'Seedless Thompson Grapes',
        variety: 'Thompson Green',
        category: 'Fruits',
        farmer_name: 'Patil Organic Farms',
        price_per_unit: 85,
        unit: 'kg',
        available_quantity_kg: 180,
        is_approved: true,
        status: 'ACTIVE',
        image_url: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=400',
      },
    ];

    if (isRealSupabase && supabaseAdmin) {
      try {
        const { data, error } = await supabaseAdmin
          .from('products')
          .select('id, name, variety, price, unit, status, categories(name), farmers(farm_name, profiles(full_name)), product_images(image_url), inventory(available_quantity)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          products = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            variety: p.variety || 'Standard',
            category: p.categories?.name || 'Produce',
            farmer_name: p.farmers?.farm_name || p.farmers?.profiles?.full_name || 'Verified Farmer',
            price_per_unit: Number(p.price) || 0,
            unit: p.unit || 'kg',
            available_quantity_kg: Number(p.inventory?.[0]?.available_quantity || p.inventory?.available_quantity || 100),
            is_approved: p.status === 'ACTIVE',
            status: p.status,
            image_url: p.product_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
          }));
        }
      } catch (err) {
        console.warn('[AdminController] Fetch products warning:', err);
      }
    }

    res.status(200).json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const updateProductStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const productId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;
    const newStatus = status || 'ACTIVE';

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('products').update({ status: newStatus }).eq('id', productId);
    }

    res.status(200).json({
      success: true,
      message: `Product status updated to ${newStatus}`,
      data: { id: productId, status: newStatus },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const statusFilter = req.query.status as string;
    let orders = [
      { id: 'AGX-8921', customer_name: 'Ayushi Par', farmer_name: 'Patil Organic Farms', total_amount: 131, payment_method: 'UPI', payment_status: 'PAID', order_status: 'Delivered', created_at: new Date().toISOString() },
      { id: 'AGX-8920', customer_name: 'Vikram Mehta', farmer_name: 'Patil Organic Farms', total_amount: 280, payment_method: 'UPI', payment_status: 'PAID', order_status: 'Ready', created_at: new Date().toISOString() },
      { id: 'AGX-8919', customer_name: 'Sneha Deshmukh', farmer_name: 'Patil Organic Farms', total_amount: 85, payment_method: 'COD', payment_status: 'PENDING', order_status: 'Preparing', created_at: new Date().toISOString() },
    ];

    if (isRealSupabase && supabaseAdmin) {
      try {
        let query = supabaseAdmin
          .from('orders')
          .select('id, order_number, total_amount, payment_status, order_status, created_at, customers(profiles(full_name)), order_items(farmers(farm_name))')
          .order('created_at', { ascending: false });

        if (statusFilter && statusFilter !== 'All') {
          query = query.ilike('order_status', `%${statusFilter}%`);
        }

        const { data, error } = await query;
        if (!error && data && data.length > 0) {
          orders = data.map((o: any) => ({
            id: o.order_number || o.id,
            customer_name: o.customers?.profiles?.full_name || 'Customer',
            farmer_name: o.order_items?.[0]?.farmers?.farm_name || 'Patil Organic Farms',
            total_amount: Number(o.total_amount) || 0,
            payment_method: 'UPI / Online',
            payment_status: o.payment_status || 'PAID',
            order_status: o.order_status || 'Delivered',
            created_at: o.created_at,
          }));
        }
      } catch (err) {
        console.warn('[AdminController] Fetch orders warning:', err);
      }
    }

    res.status(200).json({ success: true, data: orders });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orderId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { status } = req.body;

    if (isRealSupabase && supabaseAdmin) {
      await supabaseAdmin.from('orders').update({ order_status: status }).or(`id.eq.${orderId},order_number.eq.${orderId}`);
    }

    res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      data: { id: orderId, status },
    });
  } catch (err) {
    next(err);
  }
};

export const getAdminPayments = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const transactions = [
      { txnId: 'TXN-991823', orderId: 'AGX-8921', amount: 131, method: 'UPI (GPay)', status: 'Success', date: new Date().toLocaleDateString() },
      { txnId: 'TXN-991820', orderId: 'AGX-8919', amount: 135, method: 'Credit Card', status: 'Success', date: new Date().toLocaleDateString() },
      { txnId: 'TXN-991815', orderId: 'AGX-8912', amount: 450, method: 'Net Banking', status: 'Success', date: new Date().toLocaleDateString() },
    ];

    res.status(200).json({
      success: true,
      data: {
        totalGMV: 342800,
        successRate: '99.4%',
        pendingSettlement: 14280,
        transactions,
      },
    });
  } catch (err) {
    next(err);
  }
};

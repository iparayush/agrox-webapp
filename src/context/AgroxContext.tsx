import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Product,
  FarmerProfile,
  Order,
  CartItem,
  DeliveryAddress,
  NotificationItem,
  Settlement,
  OrderStatus,
  ProductCategory,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_FARMERS,
  INITIAL_ORDERS,
  MOCK_ADDRESSES,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTLEMENTS,
} from '../lib/mockData';
import { isSupabaseConfigured, fetchProductsFromSupabase, createOrderInSupabase } from '../lib/supabase';
import { api, getStoredUser, getAuthToken, clearAuth } from '../lib/api';


interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AgroxContextType {
  // Navigation & Shell
  appMode: 'gateway' | 'customer' | 'farmer' | 'admin';
  setAppMode: (mode: 'gateway' | 'customer' | 'farmer' | 'admin') => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean | ((prev: boolean) => boolean)) => void;

  // Active Screen Selectors
  customerScreen: string; // 'splash' | 'login' | 'register' | 'home' | 'search' | 'categories' | 'product_detail' | 'farmer_profile' | 'cart' | 'checkout' | 'payment' | 'orders' | 'order_tracking' | 'notifications' | 'profile' | 'settings'
  setCustomerScreen: (screen: string) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedFarmerId: string | null;
  setSelectedFarmerId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCategory: ProductCategory | 'All';
  setSelectedCategory: (cat: ProductCategory | 'All') => void;

  farmerScreen: string; // 'login' | 'register' | 'verification' | 'dashboard' | 'products' | 'add_product' | 'orders' | 'order_detail' | 'inventory' | 'earnings' | 'profile' | 'settings'
  setFarmerScreen: (screen: string) => void;

  adminScreen: string; // 'login' | 'dashboard' | 'users' | 'farmers' | 'products' | 'orders' | 'payments' | 'reports' | 'settings'
  setAdminScreen: (screen: string) => void;

  // State Entities
  products: Product[];
  farmers: FarmerProfile[];
  orders: Order[];
  cart: CartItem[];
  addresses: DeliveryAddress[];
  selectedAddressId: string;
  setSelectedAddressId: (id: string) => void;
  notifications: NotificationItem[];
  settlements: Settlement[];

  // Auth
  currentUser: any;
  setCurrentUser: (user: any) => void;
  customerLoggedIn: boolean;
  setCustomerLoggedIn: (val: boolean) => void;
  farmerLoggedIn: boolean;
  setFarmerLoggedIn: (val: boolean) => void;
  adminLoggedIn: boolean;
  setAdminLoggedIn: (val: boolean) => void;
  logout: () => void;
  loadProducts: () => Promise<void>;

  // Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: 'UPI' | 'Card' | 'Net Banking', deliveryType: 'Standard' | 'Express' | 'Scheduled') => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Farmer actions
  addProduct: (productData: Partial<Product>) => void;
  updateProductStock: (productId: string, newStock: number) => void;

  // Admin actions
  toggleProductApproval: (productId: string) => void;
  toggleFarmerApproval: (farmerId: string) => void;

  // Toast UI
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AgroxContext = createContext<AgroxContextType | undefined>(undefined);

export const AgroxProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appMode, setAppMode] = useState<'gateway' | 'customer' | 'farmer' | 'admin'>('gateway');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);

  // Role-aware auth check — each portal has its own stored role
  const _storedUser = getStoredUser();
  const _token = getAuthToken();
  const _isCustomerAuthed = !!(_token && _storedUser?._role === 'customer');
  const _isFarmerAuthed = !!(_token && _storedUser?._role === 'farmer');
  const _isAdminAuthed = !!(_token && _storedUser?._role === 'admin');

  // Screen Controllers — start at login if not authenticated
  const [customerScreen, setCustomerScreen] = useState<string>(_isCustomerAuthed ? 'home' : 'login');
  const [farmerScreen, setFarmerScreen] = useState<string>(_isFarmerAuthed ? 'dashboard' : 'login');
  const [adminScreen, setAdminScreen] = useState<string>(_isAdminAuthed ? 'dashboard' : 'login');

  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>('farmer-1');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('AGX-8921');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'All'>('All');

  // Auth States — role-separated
  const [currentUser, setCurrentUser] = useState<any>(_storedUser);
  const [customerLoggedIn, setCustomerLoggedIn] = useState<boolean>(_isCustomerAuthed);
  const [farmerLoggedIn, setFarmerLoggedIn] = useState<boolean>(_isFarmerAuthed);
  const [adminLoggedIn, setAdminLoggedIn] = useState<boolean>(_isAdminAuthed);

  const logout = () => {
    clearAuth();
    setCurrentUser(null);
    setCustomerLoggedIn(false);
    setFarmerLoggedIn(false);
    setAdminLoggedIn(false);
    setCustomerScreen('login');
    setFarmerScreen('login');
    setAdminScreen('login');
    addToast('Logged out successfully', 'info');
  };

  const loadProducts = async () => {
    try {
      const res = await api.products.list({ limit: 50 });
      if (res.success && res.data && Array.isArray(res.data.items) && res.data.items.length > 0) {
        setProducts(res.data.items.map(mapProductFromDb));
      }
    } catch (err) {
      console.warn('API products load failed, keeping mock data');
    }
  };

  // Entities
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [farmers, setFarmers] = useState<FarmerProfile[]>(INITIAL_FARMERS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 2 },
    { product: INITIAL_PRODUCTS[1], quantity: 2 },
  ]);
  const [addresses] = useState<DeliveryAddress[]>(MOCK_ADDRESSES);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(MOCK_ADDRESSES[0].id);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [settlements] = useState<Settlement[]>(INITIAL_SETTLEMENTS);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const mapProductFromDb = (dbProd: any): Product => ({
    id: dbProd.id,
    farmer_id: dbProd.farmer_id || 'farmer-1',
    farmer_name: dbProd.farmers?.profiles?.full_name || dbProd.farmer_name || 'Ramesh Patil',
    farmer_location: dbProd.farmers?.village ? `${dbProd.farmers.village}, ${dbProd.farmers.district}` : 'Nashik',
    farmer_avatar: dbProd.farmers?.profiles?.avatar_url || 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=400',
    farmer_verified: dbProd.farmers?.verification_status === 'APPROVED',
    name: dbProd.name,
    category: dbProd.categories?.name || dbProd.category || 'Vegetables',
    variety: dbProd.variety || 'Fresh Harvest',
    price_per_unit: Number(dbProd.price),
    unit: dbProd.unit || 'kg',
    available_quantity_kg: Number(dbProd.inventory?.available_quantity || dbProd.available_quantity || 100),
    min_order_qty: Number(dbProd.minimum_order_quantity || 1),
    harvest_date: dbProd.harvest_date || new Date().toISOString().split('T')[0],
    farming_method: dbProd.farming_method || 'Organic',
    description: dbProd.description || '',
    image_url: dbProd.product_images?.[0]?.image_url || dbProd.image_url || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=800',
    rating: Number(dbProd.farmers?.rating || 4.8),
    reviews_count: 5,
    is_active: dbProd.status === 'ACTIVE',
    is_approved: dbProd.status === 'ACTIVE',
    created_at: dbProd.created_at || new Date().toISOString(),
  });

  useEffect(() => {
    async function loadInitialData() {
      // Try backend API first
      await loadProducts();

      // Supabase direct fallback
      if (isSupabaseConfigured) {
        try {
          const dbProducts = await fetchProductsFromSupabase();
          if (dbProducts && dbProducts.length > 0) {
            setProducts(dbProducts.map(mapProductFromDb));
          }
        } catch (err) {
          console.warn('Supabase direct fetch fallback failed:', err);
        }
      }
    }
    loadInitialData();
  }, []);


  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart Functions
  const addToCart = (product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    addToast(`Added ${quantity} ${product.unit} ${product.name} to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  // Place Order Action
  const placeOrder = (
    paymentMethod: 'UPI' | 'Card' | 'Net Banking',
    deliveryType: 'Standard' | 'Express' | 'Scheduled'
  ): Order | null => {
    if (cart.length === 0) return null;

    const chosenAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
    const subtotal = cart.reduce((acc, item) => acc + item.product.price_per_unit * item.quantity, 0);
    const delivery_fee = deliveryType === 'Express' ? 40 : deliveryType === 'Scheduled' ? 20 : 25;
    const discount = subtotal > 200 ? 15 : 0;
    const total_amount = subtotal + delivery_fee - discount;

    const primaryFarmer = cart[0].product;

    const newOrder: Order = {
      id: `AGX-${Math.floor(1000 + Math.random() * 9000)}`,
      customer_id: 'cust-101',
      customer_name: chosenAddress.name,
      customer_phone: chosenAddress.phone,
      farmer_id: primaryFarmer.farmer_id,
      farmer_name: primaryFarmer.farmer_name,
      delivery_address: chosenAddress,
      delivery_type: deliveryType,
      items: cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price_per_unit,
        total_price: item.product.price_per_unit * item.quantity,
        unit: item.product.unit,
        image_url: item.product.image_url,
      })),
      subtotal,
      delivery_fee,
      discount,
      total_amount,
      payment_method: paymentMethod,
      payment_status: 'Paid',
      order_status: 'Placed',
      created_at: new Date().toISOString(),
      timeline: [
        { status: 'Placed', label: 'Order Placed', timestamp: 'Just now', completed: true, current: true },
        { status: 'Accepted', label: 'Farmer Accepted', completed: false, current: false },
        { status: 'Preparing', label: 'Preparing Fresh Batch', completed: false, current: false },
        { status: 'Ready', label: 'Ready for Pickup', completed: false, current: false },
        { status: 'Delivered', label: 'Delivered to Doorstep', completed: false, current: false },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);

    if (isSupabaseConfigured) {
      createOrderInSupabase({
        order_number: newOrder.id,
        customer_id: newOrder.customer_id,
        subtotal: newOrder.subtotal,
        delivery_charge: newOrder.delivery_fee,
        discount: newOrder.discount,
        total_amount: newOrder.total_amount,
        payment_status: 'PAID',
        order_status: 'FARMER_PENDING',
        delivery_address: newOrder.delivery_address,
      });
    }

    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16803C', '#3FAE5A', '#F4B942'],
      });
    } catch (e) {
      // safe fallback
    }

    addToast(`Order ${newOrder.id} placed successfully!`, 'success');

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: '🎉 Order Placed!',
      message: `Your order ${newOrder.id} of ₹${total_amount} has been received by ${primaryFarmer.farmer_name}.`,
      type: 'order',
      created_at: 'Just now',
      is_read: false,
      group: 'Today',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const updatedTimeline = ord.timeline.map((step) => {
            if (step.status === status) {
              return { ...step, completed: true, current: true, timestamp: 'Just now' };
            }
            if (ord.timeline.findIndex((s) => s.status === status) > ord.timeline.findIndex((s) => s.status === step.status)) {
              return { ...step, completed: true, current: false };
            }
            return { ...step, current: false };
          });

          return {
            ...ord,
            order_status: status,
            timeline: updatedTimeline,
          };
        }
        return ord;
      })
    );
    addToast(`Order ${orderId} status updated to ${status}`, 'info');
  };

  const addProduct = (productData: Partial<Product>) => {
    const newProd: Product = {
      id: `prod-${Date.now()}`,
      farmer_id: 'farmer-1',
      farmer_name: 'Ramesh Patil',
      farmer_location: 'Niphad, Nashik',
      farmer_avatar: 'https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&w=400&q=80',
      farmer_verified: true,
      name: productData.name || 'Fresh Produce',
      category: productData.category || 'Vegetables',
      variety: productData.variety || 'Local Fresh',
      price_per_unit: Number(productData.price_per_unit) || 30,
      unit: productData.unit || 'kg',
      available_quantity_kg: Number(productData.available_quantity_kg) || 100,
      min_order_qty: Number(productData.min_order_qty) || 1,
      harvest_date: productData.harvest_date || new Date().toISOString().split('T')[0],
      farming_method: productData.farming_method || 'Organic',
      description: productData.description || 'Freshly harvested from AGROX certified farm.',
      image_url: productData.image_url || 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviews_count: 1,
      is_active: true,
      is_approved: true,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProd, ...prev]);
    addToast(`Product "${newProd.name}" published successfully!`, 'success');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, available_quantity_kg: newStock } : p))
    );
    addToast(`Stock updated to ${newStock} kg`, 'info');
  };

  const toggleProductApproval = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_approved: !p.is_approved } : p))
    );
    addToast(`Product approval status updated`, 'info');
  };

  const toggleFarmerApproval = (farmerId: string) => {
    setFarmers((prev) =>
      prev.map((f) =>
        f.id === farmerId
          ? {
              ...f,
              is_verified: !f.is_verified,
              documents_status: !f.is_verified ? 'verified' : 'pending',
            }
          : f
      )
    );
    addToast(`Farmer verification status toggled`, 'info');
  };

  return (
    <AgroxContext.Provider
      value={{
        appMode,
        setAppMode,
        isMobileFrame,
        setIsMobileFrame,
        customerScreen,
        setCustomerScreen,
        selectedProductId,
        setSelectedProductId,
        selectedFarmerId,
        setSelectedFarmerId,
        selectedOrderId,
        setSelectedOrderId,
        selectedCategory,
        setSelectedCategory,
        farmerScreen,
        setFarmerScreen,
        adminScreen,
        setAdminScreen,
        products,
        farmers,
        orders,
        cart,
        addresses,
        selectedAddressId,
        setSelectedAddressId,
        notifications,
        settlements,
        customerLoggedIn,
        setCustomerLoggedIn,
        farmerLoggedIn,
        setFarmerLoggedIn,
        adminLoggedIn,
        setAdminLoggedIn,
        currentUser,
        setCurrentUser,
        logout,
        loadProducts,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProductStock,
        toggleProductApproval,
        toggleFarmerApproval,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AgroxContext.Provider>
  );
};

export const useAgrox = () => {
  const context = useContext(AgroxContext);
  if (!context) {
    throw new Error('useAgrox must be used within an AgroxProvider');
  }
  return context;
};

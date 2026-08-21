import React, { useEffect } from 'react';
import { AgroxProvider, useAgrox } from './context/AgroxContext';
import { CustomerBottomNav } from './components/layout/CustomerBottomNav';
import { FarmerBottomNav } from './components/layout/FarmerBottomNav';
import { FarmerMobileHeader } from './components/layout/FarmerMobileHeader';
import { AdminSidebar } from './components/layout/AdminSidebar';
import { AdminHeader } from './components/layout/AdminHeader';
import { ToastContainer } from './components/common/Toast';

// Customer Screens
import { CustomerSplash } from './apps/customer/CustomerSplash';
import { CustomerLogin } from './apps/customer/CustomerLogin';
import { CustomerRegister } from './apps/customer/CustomerRegister';
import { CustomerHome } from './apps/customer/CustomerHome';
import { CustomerSearch } from './apps/customer/CustomerSearch';
import { CustomerCategories } from './apps/customer/CustomerCategories';
import { CustomerProductDetail } from './apps/customer/CustomerProductDetail';
import { CustomerFarmerProfile } from './apps/customer/CustomerFarmerProfile';
import { CustomerCart } from './apps/customer/CustomerCart';
import { CustomerCheckout } from './apps/customer/CustomerCheckout';
import { CustomerPayment } from './apps/customer/CustomerPayment';
import { CustomerOrders } from './apps/customer/CustomerOrders';
import { CustomerOrderTracking } from './apps/customer/CustomerOrderTracking';
import { CustomerNotifications } from './apps/customer/CustomerNotifications';
import { CustomerProfile } from './apps/customer/CustomerProfile';
import { CustomerSettings } from './apps/customer/CustomerSettings';

// Farmer Screens
import { FarmerLogin } from './apps/farmer/FarmerLogin';
import { FarmerRegister } from './apps/farmer/FarmerRegister';
import { FarmerVerification } from './apps/farmer/FarmerVerification';
import { FarmerDashboard } from './apps/farmer/FarmerDashboard';
import { FarmerProducts } from './apps/farmer/FarmerProducts';
import { FarmerAddProduct } from './apps/farmer/FarmerAddProduct';
import { FarmerOrders } from './apps/farmer/FarmerOrders';
import { FarmerOrderDetail } from './apps/farmer/FarmerOrderDetail';
import { FarmerInventory } from './apps/farmer/FarmerInventory';
import { FarmerEarnings } from './apps/farmer/FarmerEarnings';
import { FarmerProfile } from './apps/farmer/FarmerProfile';
import { FarmerSettings } from './apps/farmer/FarmerSettings';

// Admin Screens
import { AdminLogin } from './apps/admin/AdminLogin';
import { AdminDashboard } from './apps/admin/AdminDashboard';
import { AdminUsers } from './apps/admin/AdminUsers';
import { AdminFarmers } from './apps/admin/AdminFarmers';
import { AdminProducts } from './apps/admin/AdminProducts';
import { AdminOrders } from './apps/admin/AdminOrders';
import { AdminPayments } from './apps/admin/AdminPayments';
import { AdminReports } from './apps/admin/AdminReports';
import { AdminSettings } from './apps/admin/AdminSettings';

const CustomerRouter: React.FC = () => {
  const { customerScreen, customerLoggedIn } = useAgrox();

  // Public screens — always accessible
  if (customerScreen === 'splash') return <CustomerSplash />;
  if (customerScreen === 'login') return <CustomerLogin />;
  if (customerScreen === 'register') return <CustomerRegister />;

  // Auth guard — redirect to login for all protected screens
  if (!customerLoggedIn) return <CustomerLogin />;

  switch (customerScreen) {
    case 'search':
      return <CustomerSearch />;
    case 'categories':
      return <CustomerCategories />;
    case 'product_detail':
      return <CustomerProductDetail />;
    case 'farmer_profile':
      return <CustomerFarmerProfile />;
    case 'cart':
      return <CustomerCart />;
    case 'checkout':
      return <CustomerCheckout />;
    case 'payment':
      return <CustomerPayment />;
    case 'orders':
      return <CustomerOrders />;
    case 'order_tracking':
      return <CustomerOrderTracking />;
    case 'notifications':
      return <CustomerNotifications />;
    case 'profile':
      return <CustomerProfile />;
    case 'settings':
      return <CustomerSettings />;
    case 'home':
    default:
      return <CustomerHome />;
  }
};

const FarmerRouter: React.FC = () => {
  const { farmerScreen, farmerLoggedIn } = useAgrox();

  // Public screens
  if (farmerScreen === 'login') return <FarmerLogin />;
  if (farmerScreen === 'register') return <FarmerRegister />;

  // Auth guard
  if (!farmerLoggedIn) return <FarmerLogin />;

  switch (farmerScreen) {
    case 'verification':
      return <FarmerVerification />;
    case 'products':
      return <FarmerProducts />;
    case 'add_product':
      return <FarmerAddProduct />;
    case 'orders':
      return <FarmerOrders />;
    case 'order_detail':
      return <FarmerOrderDetail />;
    case 'inventory':
      return <FarmerInventory />;
    case 'earnings':
      return <FarmerEarnings />;
    case 'profile':
      return <FarmerProfile />;
    case 'settings':
      return <FarmerSettings />;
    case 'dashboard':
    default:
      return <FarmerDashboard />;
  }
};

const AdminRouter: React.FC = () => {
  const { adminScreen, adminLoggedIn } = useAgrox();

  if (!adminLoggedIn || adminScreen === 'login') {
    return <AdminLogin />;
  }

  switch (adminScreen) {
    case 'users':
      return <AdminUsers />;
    case 'farmers':
      return <AdminFarmers />;
    case 'products':
      return <AdminProducts />;
    case 'orders':
      return <AdminOrders />;
    case 'payments':
      return <AdminPayments />;
    case 'reports':
      return <AdminReports />;
    case 'settings':
      return <AdminSettings />;
    case 'dashboard':
    default:
      return <AdminDashboard />;
  }
};

const MainShell: React.FC = () => {
  const { appMode, setAppMode, adminLoggedIn, adminScreen, customerScreen, farmerScreen, customerLoggedIn, farmerLoggedIn } = useAgrox();
  const customerAuthScreen = ['login', 'register', 'splash'].includes(customerScreen) || !customerLoggedIn;
  const farmerAuthScreen = ['login', 'register'].includes(farmerScreen) || !farmerLoggedIn;

  // Synchronize route with browser pathname
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    if (path.startsWith('/farmer')) {
      setAppMode('farmer');
    } else if (path.startsWith('/admin')) {
      setAppMode('admin');
    } else {
      setAppMode('customer');
    }

    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith('/farmer')) {
        setAppMode('farmer');
      } else if (p.startsWith('/admin')) {
        setAppMode('admin');
      } else {
        setAppMode('customer');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [setAppMode]);

  // 1. ADMIN PANEL (Desktop Application)
  if (appMode === 'admin') {
    return (
      <div className="min-h-screen w-full bg-[#F7F9F5] text-[#17231A]">
        {!adminLoggedIn || adminScreen === 'login' ? (
          <AdminRouter />
        ) : (
          <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#F7F9F5]">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto">
                <AdminRouter />
              </main>
            </div>
          </div>
        )}
        <ToastContainer />
      </div>
    );
  }

  // 2. FARMER APP (Full Screen Mobile First App)
  if (appMode === 'farmer') {
    return (
      <div className="min-h-screen w-full bg-[#F7F9F5] flex flex-col justify-between">
        <div className="w-full max-w-xl mx-auto bg-white min-h-screen shadow-2xs flex flex-col justify-between">
          {!farmerAuthScreen && <FarmerMobileHeader />}
          <main className="flex-1 overflow-y-auto">
            <FarmerRouter />
          </main>
          {!farmerAuthScreen && <FarmerBottomNav />}
        </div>
        <ToastContainer />
      </div>
    );
  }

  // 3. CUSTOMER APP (Full Screen Mobile First App)
  return (
    <div className="min-h-screen w-full bg-[#F7F9F5] flex flex-col justify-between">
      <div className="w-full max-w-xl mx-auto bg-white min-h-screen shadow-2xs flex flex-col justify-between">
        <main className="flex-1 overflow-y-auto">
          <CustomerRouter />
        </main>
        {!customerAuthScreen && <CustomerBottomNav />}
      </div>
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AgroxProvider>
      <MainShell />
    </AgroxProvider>
  );
}

export default App;

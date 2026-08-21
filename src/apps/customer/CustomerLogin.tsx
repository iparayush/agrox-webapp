import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff, Sparkles, Sprout, ShieldCheck, ShoppingBag } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../../lib/api';

export const CustomerLogin: React.FC = () => {
  const {
    setCustomerScreen,
    setCustomerLoggedIn,
    setFarmerLoggedIn,
    setAdminLoggedIn,
    setFarmerScreen,
    setAdminScreen,
    setAppMode,
    addToast,
    setCurrentUser,
  } = useAgrox();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { addToast('Please enter your email address', 'error'); return; }
    if (!password.trim()) { addToast('Please enter your password', 'error'); return; }
    setLoading(true);
    try {
      const res = await api.auth.login(email.trim(), password);
      if (res.success && res.data) {
        const user = res.data.user;
        const role = user.role || 'CUSTOMER';

        setAuthToken(res.data.token);
        setCurrentUser(user);

        // Smart Universal Routing based on user role
        if (role === 'FARMER') {
          setStoredUser({ ...user, _role: 'farmer' });
          setFarmerLoggedIn(true);
          setAppMode('farmer');
          setFarmerScreen('dashboard');
          window.history.pushState({}, '', '/farmer');
          addToast(`Welcome to Farmer Hub, ${user.full_name || 'Farmer'}! 🌾`, 'success');
        } else if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
          setStoredUser({ ...user, _role: 'admin' });
          setAdminLoggedIn(true);
          setAppMode('admin');
          setAdminScreen('dashboard');
          window.history.pushState({}, '', '/admin');
          addToast(`Welcome to Admin Panel, ${user.full_name || 'Administrator'}! 🛡️`, 'success');
        } else {
          // Default: Customer
          setStoredUser({ ...user, _role: 'customer' });
          setCustomerLoggedIn(true);
          setAppMode('customer');
          setCustomerScreen('home');
          window.history.pushState({}, '', '/');
          addToast(`Welcome back, ${user.full_name || 'Customer'}! 🌿`, 'success');
        }
      } else {
        addToast(res.message || 'Invalid email or password. Please try again.', 'error');
      }
    } catch {
      addToast('Could not connect to server. Please check your connection.', 'error');
    }
    setLoading(false);
  };

  const fillCredentials = (demoEmail: string, demoPass: string, roleName: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    addToast(`Filled ${roleName} credentials`, 'info');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-white">
      <div className="pt-2">
        {/* Header Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#16803C] flex items-center justify-center shadow-md">
            <img src="/agrox_logo.svg" alt="AGROX" className="w-8 h-8 object-contain" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#17231A]">Sign In 👋</h2>
            <p className="text-xs text-gray-500">Universal login for Customer, Farmer & Admin</p>
          </div>
        </div>

        {/* Quick Demo Credentials Pill Bar */}
        <div className="mb-5 bg-[#F7F9F5] p-3 rounded-2xl border border-gray-200/70">
          <div className="flex items-center gap-1.5 mb-2 text-[11px] font-bold text-gray-600">
            <Sparkles className="w-3.5 h-3.5 text-[#F4B942]" />
            <span>Quick Demo Logins (Tap to fill):</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillCredentials('customer@agrox.com', 'password123', 'Customer')}
              className="px-2 py-1.5 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] font-bold text-emerald-800 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              <ShoppingBag className="w-3 h-3 text-[#16803C]" />
              <span>Customer</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('farmer@agrox.com', 'farmer123', 'Farmer')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl text-[11px] font-bold text-amber-900 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              <Sprout className="w-3 h-3 text-[#F4B942]" />
              <span>Farmer</span>
            </button>

            <button
              type="button"
              onClick={() => fillCredentials('admin@agrox.com', 'admin123', 'Admin')}
              className="px-2 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-xl text-[11px] font-bold text-gray-800 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-2xs"
            >
              <ShieldCheck className="w-3 h-3 text-gray-700" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="w-4 h-4" />}
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-700 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs text-gray-400 hover:text-[#16803C] hover:underline transition-colors">
              Forgot Password?
            </button>
          </div>

          <Button
            fullWidth
            size="lg"
            variant="primary"
            type="submit"
            rightIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In & Enter'}
          </Button>
        </form>
      </div>

      {/* Footer Link */}
      <div className="text-center pb-3 pt-5 border-t border-gray-100">
        <span className="text-xs text-gray-500">Don't have an AGROX account? </span>
        <button
          onClick={() => setCustomerScreen('register')}
          className="text-xs font-bold text-[#16803C] hover:underline"
        >
          Create Account →
        </button>
      </div>
    </div>
  );
};

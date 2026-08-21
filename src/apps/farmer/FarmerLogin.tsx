import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, Sprout, ArrowRight, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../../lib/api';

export const FarmerLogin: React.FC = () => {
  const { setFarmerScreen, setFarmerLoggedIn, setCurrentUser, addToast } = useAgrox();
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
        // Only allow farmer roles
        if (user.role && user.role !== 'FARMER') {
          addToast('This account is not registered as a farmer. Please use the Customer portal.', 'error');
          setLoading(false);
          return;
        }
        setAuthToken(res.data.token);
        setStoredUser({ ...user, _role: 'farmer' });
        setCurrentUser(user);
        setFarmerLoggedIn(true);
        addToast(`Welcome back, ${user.full_name || 'Farmer'}! 🌾`, 'success');
        setFarmerScreen('dashboard');
      } else {
        addToast(res.message || 'Invalid email or password. Please check and try again.', 'error');
      }
    } catch {
      addToast('Could not connect to the server. Please check your connection.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-white">
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-[#F4B942] flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7 text-[#17231A]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#17231A]">Farmer Partner Hub 🌾</h2>
            <p className="text-xs text-gray-500">Sign in to your farmer account</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4" autoComplete="on">
          <Input
            label="Registered Email Address"
            type="email"
            placeholder="farmer@example.com"
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
            variant="yellow"
            type="submit"
            rightIcon={loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In to Farmer Hub'}
          </Button>
        </form>

        <div className="mt-5 flex items-start gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <ShieldCheck className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
          <span>Farmer accounts require verified 7/12 land record & KYC approval before selling.</span>
        </div>
      </div>

      {/* Footer Register Link */}
      <div className="text-center pb-4 pt-6 border-t border-gray-100">
        <span className="text-xs text-gray-500">New to AGROX Farmer Network? </span>
        <button
          onClick={() => setFarmerScreen('register')}
          className="text-xs font-bold text-[#16803C] hover:underline"
        >
          Register as Farmer →
        </button>
      </div>
    </div>
  );
};

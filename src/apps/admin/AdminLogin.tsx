import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Mail, Lock, ShieldCheck, ArrowRight, Loader2, Zap, Key } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../../lib/api';

export const AdminLogin: React.FC = () => {
  const { setAdminScreen, setAdminLoggedIn, setCurrentUser, addToast } = useAgrox();
  const [email, setEmail] = useState('admin@agrox.com');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      addToast('Please enter both email and password', 'error');
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.login(email, password);
      if (res.success && res.data) {
        // Validate Admin Role
        const role = res.data.user?.role;
        if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
          addToast('Access Denied: You do not have administrator permissions.', 'error');
          setLoading(false);
          return;
        }

        setAuthToken(res.data.token);
        setStoredUser({ ...res.data.user, _role: 'admin' });
        setCurrentUser(res.data.user);
        setAdminLoggedIn(true);
        addToast(`Admin access granted. Welcome, ${res.data.user.full_name || 'Administrator'}!`, 'success');
        setAdminScreen('dashboard');
      } else {
        addToast(res.message || 'Authentication failed. Check credentials.', 'error');
      }
    } catch {
      addToast('Could not connect to server. Is the backend running?', 'error');
    }
    setLoading(false);
  };

  const fillAdminCreds = () => {
    setEmail('admin@agrox.com');
    setPassword('admin123');
    addToast('Filled Admin Credentials', 'info');
  };

  return (
    <div className="min-h-screen bg-[#17231A] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white text-[#17231A] p-8 rounded-3xl shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-[#16803C] p-2 mx-auto shadow-md flex items-center justify-center">
            <img src="/agrox_logo.svg" alt="AGROX Admin" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-2xl font-black tracking-wider text-[#17231A]">AGROX Admin Portal</h2>
          <p className="text-xs text-gray-500 font-medium">Enterprise Marketplace Controller</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="Administrator Email"
            type="email"
            placeholder="admin@agrox.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Master Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          {show2FA && (
            <Input
              label="2FA Authenticator Code"
              type="text"
              placeholder="6-digit code (e.g. 849201)"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              leftIcon={<Key className="w-4 h-4" />}
            />
          )}

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={fillAdminCreds}
              className="font-bold text-[#16803C] hover:underline flex items-center gap-1"
            >
              <Zap className="w-3.5 h-3.5 text-[#F4B942]" />
              <span>Fill Admin Demo</span>
            </button>
            <button
              type="button"
              onClick={() => setShow2FA(!show2FA)}
              className="text-gray-400 hover:text-gray-600 underline"
            >
              {show2FA ? 'Hide 2FA' : '+ Add 2FA Code'}
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
            {loading ? 'Verifying Security Token...' : 'Access Admin Portal'}
          </Button>
        </form>

        <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 font-medium pt-2 border-t border-gray-100">
          <ShieldCheck className="w-4 h-4 text-[#16803C]" />
          <span>Restricted to Authorized System Administrators</span>
        </div>
      </div>
    </div>
  );
};

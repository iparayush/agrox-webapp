import React, { useState } from 'react';
import { useAgrox } from '../../context/AgroxContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { User, Phone, Mail, Lock, CheckCircle2, Loader2 } from 'lucide-react';
import { api, setAuthToken, setStoredUser } from '../../lib/api';

export const CustomerRegister: React.FC = () => {
  const { setCustomerScreen, setCustomerLoggedIn, addToast, setCurrentUser } = useAgrox();
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.auth.register({
        full_name: fullName,
        email,
        phone: mobile,
        password,
        role: 'CUSTOMER',
      });
      if (res.success && res.data) {
        setAuthToken(res.data.token);
        setStoredUser({ ...res.data.user, _role: 'customer' });
        setCurrentUser(res.data.user);
        setCustomerLoggedIn(true);
        addToast('Account created successfully! Welcome to AGROX.', 'success');
        setCustomerScreen('home');
      } else {
        addToast(res.message || 'Registration failed. Please try again.', 'error');
      }
    } catch {
      addToast('Network error. Is the server running?', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-between p-6 bg-white">
      <div className="pt-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <img src="/agrox_logo.svg" alt="AGROX Logo" className="w-10 h-10" />
          <div>
            <h2 className="text-xl font-black text-[#17231A]">Create your AGROX account</h2>
            <p className="text-xs text-gray-500">Get fresh harvest delivered direct from farms</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            placeholder="e.g. Ayushi Par"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Mobile Number"
            type="tel"
            placeholder="e.g. +91 98234 56789"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            leftIcon={<Phone className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <div className="flex items-start gap-2 bg-[#F7F9F5] p-3 rounded-xl border border-gray-100 text-xs text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-[#16803C] shrink-0 mt-0.5" />
            <span>
              By signing up, you agree to AGROX Terms of Service and Privacy Policy.
            </span>
          </div>

          <Button fullWidth size="lg" variant="primary" type="submit" className="mt-2" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin inline mr-2" />Creating...</> : 'Create Account'}
          </Button>
        </form>
      </div>

      {/* Footer link */}
      <div className="text-center pb-4 pt-6 border-t border-gray-100">
        <span className="text-xs text-gray-500">Already have an account? </span>
        <button
          onClick={() => setCustomerScreen('login')}
          className="text-xs font-bold text-[#16803C] hover:underline"
        >
          Login
        </button>
      </div>
    </div>
  );
};

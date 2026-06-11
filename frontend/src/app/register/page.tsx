'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { User, Mail, Lock, UserCheck, Briefcase, RefreshCw, ChevronRight } from 'lucide-react';

export default function EnhancedRegisterPage() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<'client' | 'freelancer'>('freelancer');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegisterSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Validation Error: All ledger metadata fields required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password, role });
      toast.success('Registration signature recorded cleanly! Proceed to access gateway.');
      router.push('/login');
    } catch (error: unknown) {
      const apiError = error as { response?: { data?: { message?: string } } };
      toast.error(apiError.response?.data?.message || 'Cluster exception: Account registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 space-y-6 text-neutral-800">
        
        <div className="text-center space-y-1.5">
          <div className="h-7 w-7 rounded-lg bg-[#0A1931] flex items-center justify-center text-white font-black text-xs tracking-tighter mx-auto mb-3">
            N
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">
            Create account
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            Register your workspace profile coordinates down into the network.
          </p>
        </div>

        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="flex bg-[#F1F5F9] p-1 rounded-xl border border-neutral-200/40 gap-1">
            <div
              onClick={() => setRole('freelancer')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer select-none text-xs font-bold transition-all ${
                role === 'freelancer'
                  ? 'bg-white text-[#0A1931] shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              <span>Freelancer</span>
            </div>

            <div
              onClick={() => setRole('client')}
              className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer select-none text-xs font-bold transition-all ${
                role === 'client'
                  ? 'bg-white text-[#0A1931] shadow-sm'
                  : 'text-neutral-400 hover:text-neutral-600'
              }`}
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Client</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Name :</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="kongkon ray"
                className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Email :</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Password:</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A1931] hover:bg-[#122b52] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>Register <ChevronRight className="h-4 w-4" /></>
            )}
          </button>
        </form>

        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-xs text-neutral-400 font-medium">
            Already verified cluster session key?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-[#0A1931] font-bold hover:underline cursor-pointer select-none"
            >
              Sign In To System
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
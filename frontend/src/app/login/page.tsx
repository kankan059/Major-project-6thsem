'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { AuthResponse } from '@/app/types/auth';
import { Mail, Lock, Eye, EyeOff, RefreshCw, ArrowRight } from 'lucide-react';

interface AxiosErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface AuthResponseWithRole extends AuthResponse {
  role?: string;
}

export default function PremiumMinimalistLogin() {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post<AuthResponseWithRole>('/auth/login', { email, password });

      if (!res.data || !res.data.token) {
        toast.error('Authentication payload verification failed.');
        setLoading(false);
        return;
      }

      const token = res.data.token;
      const userObj: AuthResponseWithRole = res.data;
      const verifiedRole = userObj.role ? userObj.role.toLowerCase() : 'freelancer';

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userObj));

      toast.success('Session authorized. Welcome back!');

      setTimeout(() => {
        if (verifiedRole === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (verifiedRole === 'client') {
          window.location.href = '/dashboard/client';
        } else {
          window.location.href = '/dashboard/freelancer';
        }
      }, 400);
    } catch (error: unknown) {
      const typedError = error as AxiosErrorResponse;
      console.error('Authentication Node Exception:', typedError);
      toast.error(typedError.response?.data?.message || 'Access Denied: Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-6 font-sans antialiased">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-8 sm:p-10 space-y-6 text-neutral-800">

        <div className="space-y-1.5 text-left">
          <div className="h-7 w-7 rounded-lg bg-[#0A1931] flex items-center justify-center text-white font-black text-xs tracking-tighter mx-auto md:mx-0">
            N
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931] mt-4 text-center md:text-left">
            Sign in to platform
          </h2>
          <p className="text-xs text-neutral-400 font-medium text-center md:text-left">
            Enter your credentials to access your workspace ecosystem.
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-11 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#0A1931] hover:bg-[#122b52] text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-6 cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <>Continue <ArrowRight className="h-3.5 w-3.5" /></>
            )}
          </button>
        </form>

        <div className="border-t border-neutral-100 pt-4 text-center">
          <p className="text-xs text-neutral-400 font-medium">
            Don&ldquo;t have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-[#0A1931] font-bold hover:underline cursor-pointer select-none"
            >
              Sign up
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
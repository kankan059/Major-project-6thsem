'use client';
import React, { useState } from 'react';
import { useRouter, } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Home, ArrowLeft, Menu, X, LogOut, Briefcase, User } from 'lucide-react';

export default function GlobalHeaderMaster() {
  const router = useRouter();
  // const pathname = usePathname();
  const { logout, isClient,isAdmin, isAuthenticated } = useAuth();

  // Mobile drawer panel responsiveness state track variable
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Determine landing route depending on authenticated registration tokens
  const handleHomeRouting = () => {
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    router.push(isClient ? '/dashboard/client' : isAdmin ? "/dashboard/admin" :'/dashboard/freelancer');
  };
  const handleForceLogout = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if (logout) {
        logout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <nav className="w-full bg-[#0A1931] border-b border-[#1A3D63] text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* LEFT CHANNELS: Brand Identity System */}
          <div className="flex items-center gap-2 cursor-pointer select-none" onClick={handleHomeRouting}>
            <div className="h-8 w-8 rounded-lg bg-[#4AFAF7] flex items-center justify-center text-[#0A1931] font-black tracking-tighter">
              K
            </div>
            <span className="font-black text-lg tracking-tight uppercase bg-gradient-to-r from-white to-[#B3CFE5] bg-clip-text text-transparent">
              K<span className="text-[#4AFAF7]">FREE</span>
            </span>
          </div>

          {/* CENTER CORE: Desktop Navigation Grid Framework Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={handleHomeRouting}
              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#B3CFE5] hover:text-[#4AFAF7] transition-all px-3 py-2 rounded-xl bg-[#1A3D63]/30 hover:bg-[#1A3D63]"
            >
              <Home className="h-4 w-4" /> Home
            </button>
            {isAuthenticated && (
              <button
                onClick={() => router.push('/dashboard/jobs')}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#B3CFE5] hover:text-[#4AFAF7] transition-all px-3 py-2 rounded-xl"
              >
                <Briefcase className="h-4 w-4" /> Browse Jobs
              </button>
            )}
          </div>

          {/* RIGHT ACTIONS BLOCK: Profile Status Signouts */}
          <div className="hidden md:flex items-center gap-3">

            {isAuthenticated ? (
              <div className="flex items-center gap-3">

                <span
                  onClick={() => router.push('/dashboard/profile')}
                  className="text-xs font-mono bg-[#1A3D63] text-[#4AFAF7] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide flex items-center gap-1 cursor-pointer hover:opacity-80"
                >
                 <User className="h-3 w-3" /> {isAdmin ? 'Admin' : isClient ? 'Client' : 'Freelancer'}
                </span>
                <button
                  onClick={handleForceLogout}
                  className="flex items-center gap-1 text-xs font-black uppercase bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-900/40 px-3 py-2 rounded-xl transition-all"
                >
                  <LogOut className="h-3.5 w-3.5" /> LOGOUT
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/register')}
                className="text-xs font-black uppercase bg-[#4AFAF7] text-[#0A1931] px-4 py-2 rounded-xl hover:opacity-90 transition-all"
              >
                Access Portal
              </button>
            )}
          </div>

          {/* HAMBURGER TRIGGER BUTTON FOR MOBILE PHONES DISPLAY DEVICES */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-[#B3CFE5] hover:text-white transition-all focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6 text-[#4AFAF7]" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* DYNAMIC COLLAPSED INTERACTIVE MENU OVERLAY FOR MOBILE LAYOUT CHANNELS */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A1931] border-t border-[#1A3D63] animate-fadeIn">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 text-sm font-bold uppercase tracking-wider">

            <button
              onClick={() => {
                handleHomeRouting();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-[#B3CFE5] hover:text-white hover:bg-[#1A3D63] rounded-xl transition-all"
            >
              <Home className="h-4 w-4 text-[#4AFAF7]" /> Dashboard Home
            </button>


            {isAuthenticated && (
              <button
                onClick={() => {
                  router.push('/dashboard/jobs');
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-[#B3CFE5] hover:text-white hover:bg-[#1A3D63] rounded-xl transition-all"
              >
                <Briefcase className="h-4 w-4" /> Market Feed
              </button>
            )}

            <div className="h-px bg-[#1A3D63] my-2 mx-4" />

            <div className="px-4 py-2">
              {isAuthenticated ? (
                <div className="space-y-3">
                  <span className="block text-center text-xs font-mono bg-[#1A3D63] text-[#4AFAF7] py-1.5 rounded-lg">
                    ROLE // {isClient ? 'CLIENT_MODE' : 'FREELANCER_MODE'}
                  </span>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-red-950/60 text-red-400 border border-red-900/50 rounded-xl font-black text-xs"
                  >
                    <LogOut className="h-4 w-4" /> Clear Current Session
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    router.push('/auth/login');
                    setIsMenuOpen(false);
                  }}
                  className="w-full py-3 bg-[#4AFAF7] text-[#0A1931] rounded-xl font-black text-center text-xs"
                >
                  Portal Authorization Login
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}
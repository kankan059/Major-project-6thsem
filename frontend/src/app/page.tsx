'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function PremiumHomePage() {
  return (
    <div className="w-full bg-white dark:bg-[#0A1931] transition-colors duration-300">
      
      {/* Structural Hero Mesh Grid */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 dark:border-[#1A3D63] bg-neutral-50 dark:bg-[#1A3D63]/30 text-xs font-mono font-bold tracking-wider text-indigo-600 dark:text-[#4AFAF7] uppercase">
          <Zap className="h-3.5 w-3.5" /> 6th semester Major Project
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-neutral-900 dark:text-white max-w-4xl mx-auto leading-none">
          Deploy Contracts. <br />
          <span className="bg-gradient-to-r from-indigo-600 to-sky-400 bg-clip-text text-transparent">Hire Premium Talent.</span>
        </h1>
        
        <p className="text-neutral-500 dark:text-[#B3CFE5]/80 text-base sm:text-lg max-w-2xl mx-auto font-medium">
          A high-fidelity micro-contracting engine built on strict validation mechanics, verified milestone escrows, and isolated real-time sync networks.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link href="/register" className="px-6 py-3.5 bg-neutral-900 dark:bg-[#4AFAF7] text-white dark:text-[#0A1931] font-bold rounded-xl text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-600/10 flex items-center gap-1.5">
            Initialize Workspace <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/jobs" className="px-6 py-3.5 border border-neutral-300 dark:border-[#1A3D63] text-neutral-700 dark:text-[#B3CFE5] font-semibold rounded-xl text-sm hover:bg-neutral-50 dark:hover:bg-[#1A3D63]/30 transition-all">
            Explore Marketplace
          </Link>
        </div>
      </section>

      {/* Grid Allocation Split Blocks */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-neutral-100 dark:border-[#1A3D63]/40">
        <div className="p-6 border border-neutral-200 dark:border-[#1A3D63] rounded-2xl bg-neutral-50/50 dark:bg-[#1A3D63]/10 space-y-3">
          <ShieldCheck className="h-6 w-6 text-indigo-600 dark:text-[#4AFAF7]" />
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Milestone Verification</h3>
          <p className="text-sm text-neutral-500 dark:text-[#B3CFE5]/70">Cryptographic signature controls bind funding models directly to programmatic payment triggers.</p>
        </div>
        <div className="p-6 border border-neutral-200 dark:border-[#1A3D63] rounded-2xl bg-neutral-50/50 dark:bg-[#1A3D63]/10 space-y-3">
          <Layers className="h-6 w-6 text-indigo-600 dark:text-[#4AFAF7]" />
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Role-Isolated Interfaces</h3>
          <p className="text-sm text-neutral-500 dark:text-[#B3CFE5]/70">Separate, customized configuration environments prevent contextual leaks between operating layers.</p>
        </div>
        <div className="p-6 border border-neutral-200 dark:border-[#1A3D63] rounded-2xl bg-neutral-50/50 dark:bg-[#1A3D63]/10 space-y-3">
          <Zap className="h-6 w-6 text-indigo-600 dark:text-[#4AFAF7]" />
          <h3 className="font-bold text-lg text-neutral-900 dark:text-white">Real-Time Data Streams</h3>
          <p className="text-sm text-neutral-500 dark:text-[#B3CFE5]/70">Continuous room routing allocations connect contract parties through instantaneous message pipelines.</p>
        </div>
      </section>

    </div>
  );
}
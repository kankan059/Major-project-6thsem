'use client';
import React from 'react';
import { FreelancerStats } from '@/app/types/freelance';
import { CreditCard, Box, TrendingUp } from 'lucide-react';

interface StatsGridProps {
  stats: FreelancerStats;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      
      {/* Earnings Widget */}
      <div className="bg-white border border-[#B3CFE5]/30 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-[#1A3D63] transition-all duration-300">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Escrow Ledger Balance</span>
          <h3 className="text-2xl font-black text-[#0A1931]">₹{stats.totalEarnings.toLocaleString('en-IN')}.00</h3>
        </div>
        <div className="p-3 bg-[#F6FAFD] text-[#1A3D63] rounded-xl border border-[#B3CFE5]/20">
          <CreditCard className="h-5 w-5 text-[#1A3D63]" />
        </div>
      </div>

      {/* Active Jobs Widget */}
      <div className="bg-white border border-[#B3CFE5]/30 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-[#1A3D63] transition-all duration-300">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Active Contracts</span>
          <h3 className="text-2xl font-black text-[#0A1931]">{stats.activeContractsCount} Active</h3>
        </div>
        <div className="p-3 bg-[#F6FAFD] text-[#1A3D63] rounded-xl border border-[#B3CFE5]/20">
          <Box className="h-5 w-5 text-[#1A3D63]" />
        </div>
      </div>

      {/* Proposal Tracking Widget */}
      <div className="bg-white border border-[#B3CFE5]/30 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-[#1A3D63] transition-all duration-300">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Proposals Submitted</span>
          <h3 className="text-2xl font-black text-[#0A1931]">{stats.proposalCount} Total</h3>
        </div>
        <div className="p-3 bg-[#F6FAFD] text-[#1A3D63] rounded-xl border border-[#B3CFE5]/20">
          <TrendingUp className="h-5 w-5 text-[#1A3D63]" />
        </div>
      </div>

    </div>
  );
}
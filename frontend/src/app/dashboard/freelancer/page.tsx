'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { FreelancerBid, FreelancerStats } from '@/app/types/freelance';
import StatsGrid from '@/components/StateGrid';
import ProposalRow from '@/components/ProposalRow';
import { Terminal, FolderGit2, Compass } from 'lucide-react';

interface BackendErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function FreelancerDashboard() {
  const router = useRouter();
  const { isFreelancer, isAuthenticated } = useAuth();
  
  const [bids, setBids] = useState<FreelancerBid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<FreelancerStats>({
    totalEarnings: 0,
    activeContractsCount: 0,
    proposalCount: 0,
  });

  // Structural Router Route Authentication Guard
  useEffect(() => {
    if (!isAuthenticated || !isFreelancer) {
      router.push('/login');
    }
  }, [isAuthenticated, isFreelancer, router]);

  useEffect(() => {
    const fetchFreelancerHistory = async (): Promise<void> => {
      try {
        // Backend endpoint expects to read req.user.id internally to fetch freelancer-specific bids
        const res = await api.get<FreelancerBid[]>('/bids'); 
        const bidsData = res.data;
        setBids(bidsData);

        // Compute runtime aggregated analytics without altering DB schemas
        const activeContracts = bidsData.filter(b => b.status === 'accepted');
        const totalEarningsCalculated = activeContracts.reduce((sum, current) => sum + current.bidAmount, 0);

        setStats({
          totalEarnings: totalEarningsCalculated,
          activeContractsCount: activeContracts.length,
          proposalCount: bidsData.length,
        });
      } catch (error) {
        const err = error as BackendErrorResponse;
        toast.error(err.response?.data?.message || 'Failed to sync execution metrics from database cluster.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isFreelancer) {
      fetchFreelancerHistory();
    }
  }, [isAuthenticated, isFreelancer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] flex items-center justify-center">
        <p className="text-sm font-bold tracking-widest text-neutral-400 animate-pulse uppercase font-mono">
          Syncing Token Handshakes...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFD] text-[#0A1931] font-sans pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Deep Tech Colored Banner Block Header */}
        <div className="bg-[#0A1931] border border-[#1A3D63] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-2xl">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#4AFAF7] font-mono text-[11px] font-bold tracking-widest uppercase mb-1">
              <Terminal className="h-3.5 w-3.5" /> Node Cluster Active
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Freelancer Work Desk</h1>
            <p className="text-[#B3CFE5] text-sm font-medium">Evaluate current bid feedback parameters, launch strategies, and step into active codebases.</p>
          </div>
          <button 
            onClick={() => router.push('/dashboard/jobs')}
            className="flex items-center gap-1.5 bg-[#1A3D63] border border-[#4AFAF7]/30 text-[#4AFAF7] text-xs font-mono font-bold px-4 py-2.5 rounded-xl hover:bg-[#1A3D63]/80 transition-all"
          >
            <Compass className="h-4 w-4" /> Open Market Feed
          </button>
        </div>

        {/* Modular Analytics Components Injection */}
        <StatsGrid stats={stats} />

        {/* Proposals Data Logs Core Node */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-[#0A1931]">
            <FolderGit2 className="h-5 w-5 text-[#1A3D63]" /> Active Logs & Project Pitches
          </h2>

          {bids.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#B3CFE5]/40 rounded-3xl text-center bg-white/50 max-w-xl mx-auto space-y-3 shadow-sm">
              <FolderGit2 className="h-10 w-10 text-neutral-300" />
              <div>
                <h3 className="font-bold text-[#0A1931]">No Active Logs Found</h3>
                <p className="text-xs text-neutral-400 font-medium mt-0.5">You have not deployed any proposal scripts to the marketplace yet.</p>
              </div>
              <button 
                onClick={() => router.push('/dashboard/jobs')}
                className="px-4 py-2 bg-[#0A1931] text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
              >
                Browse Marketplace Proposals
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {bids.map((bid: FreelancerBid) => (
                <ProposalRow key={bid._id} bid={bid} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
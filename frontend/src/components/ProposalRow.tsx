'use client';
import React from 'react';
import { FreelancerBid } from '@/app/types/freelance';
import { IndianRupee, Clock, Calendar, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProposalRowProps {
  bid: FreelancerBid;
}

export default function ProposalRow({ bid }: ProposalRowProps) {
  const router = useRouter();

  const statusStyles = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    accepted: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/50',
    rejected: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50',
  };

  return (
    <div className="bg-white border border-[#B3CFE5]/30 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Bid Info & Project Link metadata */}
      <div className="space-y-2 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider font-bold bg-[#1A3D63] px-2 py-0.5 rounded text-[#4AFAF7] uppercase">
            {bid.job?.category || 'General'}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase border ${statusStyles[bid.status]}`}>
            {bid.status}
          </span>
        </div>
        <h3 className="text-lg font-extrabold text-[#0A1931] tracking-tight">
          {bid.job?.title || 'Unknown Project Specification'}
        </h3>
        <p className="text-xs text-neutral-400 flex items-center gap-1 font-mono">
          <Calendar className="h-3.5 w-3.5" /> Deployed: {new Date(bid.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Metrics Allocation Block */}
      <div className="flex items-center justify-between md:justify-end w-full md:w-auto border-t md:border-t-0 border-[#B3CFE5]/20 pt-3 md:pt-0 gap-6">
        <div className="text-right space-y-0.5">
          <div className="text-sm font-black text-[#0A1931] flex items-center justify-end">
            <IndianRupee className="h-3.5 w-3.5" /> {bid.bidAmount}
          </div>
          <div className="text-xs text-neutral-400 flex items-center gap-1 justify-end">
            <Clock className="h-3.5 w-3.5 text-neutral-300" /> {bid.estimatedDays} Days
          </div>
        </div>

        {/* If contract is accepted, give navigation access to the room workspace */}
        {bid.status === 'accepted' ? (
          <button 
            onClick={() => router.push(`/dashboard/workspace/${bid.job?._id}`)}
            className="flex items-center gap-1 bg-[#0A1931] border border-[#1A3D63] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#1A3D63] transition-all shadow-sm"
          >
            Workspace <ChevronRight className="h-3.5 w-3.5 text-[#4AFAF7]" />
          </button>
        ) : (
          <button 
            onClick={() => router.push(`/dashboard/jobs/${bid.job?._id}`)}
            className="flex items-center gap-1 border border-[#B3CFE5] text-[#1A3D63] text-xs font-semibold px-3 py-2 rounded-xl hover:bg-[#F6FAFD] transition-all"
          >
            View Post
          </button>
        )}
      </div>

    </div>
  );
}
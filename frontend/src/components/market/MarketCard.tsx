'use client';
import React from 'react';
import { MarketplaceJob } from '@/app/types/jobs';
import { useRouter } from 'next/navigation';
import { IndianRupee, Calendar, ArrowUpRight, Tag, User } from 'lucide-react';

interface MarketplaceCardProps {
  job: MarketplaceJob;
}

export default function MarketplaceCard({ job }: MarketplaceCardProps) {
  const router = useRouter();

  return (
    <div className="p-6 border border-[#B3CFE5]/30 rounded-2xl bg-white hover:border-[#1A3D63] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-[#0A1931]">
      
      {/* Content Meta Grid Block */}
      <div className="space-y-3 max-w-2xl">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center gap-1 font-mono bg-[#1A3D63] text-[#4AFAF7] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
            <Tag className="h-3 w-3" /> {job.category}
          </span>
          <span className="flex items-center gap-1 text-neutral-400 font-medium">
            <Calendar className="h-3.5 w-3.5" /> {new Date(job.createdAt).toLocaleDateString()}
          </span>
          <span className="text-neutral-400 font-medium flex items-center gap-1 ml-1">
            <User className="h-3.5 w-3.5 text-[#1A3D63]/60" /> Posted by {job.client?.name || 'Enterprise'}
          </span>
        </div>
        
        <h2 className="text-xl font-black tracking-tight">{job.title}</h2>
        <p className="text-sm text-neutral-500 font-medium line-clamp-2 leading-relaxed">{job.description}</p>
      </div>

      {/* Pricing / CTA Interaction Panel */}
      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-[#B3CFE5]/20 pt-4 md:pt-0 gap-3">
        <div className="text-left md:text-right">
          <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">Est. Budget</span>
          <span className="text-xl font-black flex items-center text-[#0A1931] mt-0.5">
            <IndianRupee className="h-4 w-4" /> {job.budget.toLocaleString('en-IN')}
          </span>
        </div>
        
        <button 
          onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
          className="flex items-center gap-1.5 bg-[#0A1931] border border-[#1A3D63] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#1A3D63] transition-all shadow-sm shadow-[#0A1931]/10"
        >
          View <ArrowUpRight className="h-4 w-4 text-[#4AFAF7]" />
        </button>
      </div>

    </div>
  );
}
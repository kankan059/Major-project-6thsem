'use client';
import React from 'react';
import { Job } from '@/app/types/jobs';
import { useRouter } from 'next/navigation';
import { IndianRupee, AlertCircle, CheckCircle2, MessageSquare, ShieldAlert } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-[#BEB5A9] rounded-2xl p-6 flex flex-col justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono tracking-wider font-bold bg-[#E1D4C2] px-2 py-1 rounded text-[#6E473B] uppercase">
            {job.category}
          </span>
          <span className="text-xs font-bold flex items-center text-[#291CDE]">
            <IndianRupee className="h-3.5 w-3.5" /> {job.budget.toLocaleString('en-IN')}
          </span>
        </div>
        <h3 className="text-xl font-extrabold tracking-tight text-[#6E473B]">{job.title}</h3>
        <p className="text-sm text-[#A78D78] font-medium line-clamp-3 leading-relaxed">{job.description}</p>
      </div>

      <div className="flex items-center justify-between border-t border-[#E1D4C2] pt-4 mt-2">
        <span className="text-[11px] text-[#A78D78] font-mono">
          ID: {job._id.substring(0, 8)}...
        </span>

        {/* 1. Open Job Status Layout */}
        {job.status === 'open' && (
          <button
            onClick={() => router.push(`/dashboard/client/jobs/${job._id}/bids`)}
            className="bg-[#291CDE] text-white text-xs font-bold px-4 py-2 rounded-xl hover:opacity-90 shadow-sm transition-all"
          >
            Evaluate Proposals
          </button>
        )}

        {/* 2. Active Running Status Layout */}
        {job.status === 'active' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 flex items-center gap-1 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> In Progress
            </span>
            <button
              onClick={() => router.push(`/dashboard/workspace/${job._id}`)}
              className="bg-[#6E473B] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 flex items-center gap-1 transition-all shadow-sm"
            >
              <MessageSquare className="h-3.5 w-3.5 text-[#E1D4C2]" /> Workspace
            </button>
          </div>
        )}

        {/* 3. NEW STATE GUARD: Under Review Submission Status Layout */}
        {job.status === 'under_review' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-lg animate-pulse">
              <ShieldAlert className="h-3.5 w-3.5 text-indigo-600" /> Pending Review
            </span>
            <button
              onClick={() => router.push(`/dashboard/workspace/${job._id}`)}
              className="bg-[#291CDE] text-white text-xs font-bold px-3 py-2 rounded-xl hover:opacity-90 flex items-center gap-1 transition-all shadow-md shadow-[#291CDE]/10"
            >
              Audit Deliverables
            </button>
          </div>
        )} 

        {/* 4. Completed Closed Status Layout */}
        {job.status === 'completed' && (
          <span className="text-xs font-bold text-green-700 flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
            <CheckCircle2 className="h-3.5 w-3.5" /> Completed Successfully
          </span>
        )}
      </div>
    </div>
  );
}
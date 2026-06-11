'use client';
import React from 'react';
import { Bid } from '@/app/types/bids';
import { IndianRupee, Clock, CheckCircle, User } from 'lucide-react';

interface BidCardProps {
  bid: Bid;
  onAccept: (bidId: string) => void;
  isProcessing: boolean;
}

export default function BidCard({ bid, onAccept, isProcessing }: BidCardProps) {
  const isAccepted = bid.status === 'accepted';

  return (
    <div 
      className={`p-6 border rounded-2xl transition-all flex flex-col justify-between gap-5 bg-white shadow-sm ${
        isAccepted ? 'border-[#291CDE] ring-1 ring-[#291CDE]' : 'border-[#BEB5A9]'
      }`}
    >
      {/* Bidder Meta Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-[#E1D4C2] pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#E1D4C2]/50 text-[#6E473B] border border-[#BEB5A9]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#6E473B]">{bid.freelancer?.name}</h3>
            <p className="text-xs text-[#A78D78] font-medium">{bid.freelancer?.email}</p>
          </div>
        </div>

        {/* Financial and Timeline Parameters */}
        <div className="flex gap-4 text-sm font-bold">
          <div className="flex items-center gap-0.5 text-[#291CDE]">
            <IndianRupee className="h-4 w-4" /> {bid.bidAmount}
          </div>
          <div className="flex items-center gap-1 text-[#6E473B]">
            <Clock className="h-4 w-4 text-[#A78D78]" /> {bid.estimatedDays} Days
          </div>
        </div>
      </div>

      {/* Cover Letter Body Area */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#A78D78] mb-1.5">Strategy Proposal</h4>
        <p className="text-sm text-[#6E473B] font-medium whitespace-pre-wrap leading-relaxed">
          {bid.proposalText}
        </p>
      </div>

      {/* Logic Trigger Interactive Row */}
      <div className="flex items-center justify-end pt-2">
        {bid.status === 'pending' ? (
          <button
            onClick={() => onAccept(bid._id)}
            disabled={isProcessing}
            className="flex items-center gap-2 bg-[#291CDE] text-white text-xs font-black px-5 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all shadow-md shadow-[#291CDE]/10"
          >
            <CheckCircle className="h-4 w-4" /> {isProcessing ? 'Assigning Contract...' : 'Accept Proposal'}
          </button>
        ) : (
          <span className="text-xs font-mono uppercase bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-green-700 font-bold">
            Contract Assigned
          </span>
        )}
      </div>
    </div>
  );
}
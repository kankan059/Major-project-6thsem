'use client';
import React, { useState } from 'react';
import { ProposalSubmitData } from '@/app/types/jobs';
import { IndianRupee, Clock, Send } from 'lucide-react';

interface ProposalFormProps {
  onSubmit: (data: ProposalSubmitData) => Promise<void>;
}

export default function ProposalForm({ onSubmit }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalSubmitData>({
    bidAmount: '',
    estimatedDays: '',
    proposalText: '',
  });
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
  };

  return (
    <div className="border border-[#B3CFE5]/30 rounded-2xl p-6 bg-white shadow-sm">
      <h2 className="text-xl font-black text-[#0A1931] tracking-tight mb-4 flex items-center gap-2">
        Pitch Your Proposal Blueprint
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 text-[#0A1931]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Your Bid Amount (INR)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input 
                type="number" required
                value={formData.bidAmount}
                onChange={(e) => setFormData({...formData, bidAmount: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-[#F6FAFD] outline-none focus:ring-2 focus:ring-[#0A1931] text-sm font-semibold"
                placeholder="4500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Estimated Duration (Days)
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input 
                type="number" required
                value={formData.estimatedDays}
                onChange={(e) => setFormData({...formData, estimatedDays: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-[#F6FAFD] outline-none focus:ring-2 focus:ring-[#0A1931] text-sm font-semibold"
                placeholder="5"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1">
            Technical Strategy / Cover Letter
          </label>
          <textarea 
            required rows={5}
            value={formData.proposalText}
            onChange={(e) => setFormData({...formData, proposalText: e.target.value})}
            className="w-full px-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-[#F6FAFD] outline-none focus:ring-2 focus:ring-[#0A1931] text-sm font-medium resize-none leading-relaxed"
            placeholder="Outline your developmental framework roadmap, milestones expectations, and integration strategies..."
          />
        </div>

        <button 
          type="submit" disabled={submitting}
          className="w-full py-3.5 bg-[#0A1931] text-white font-extrabold rounded-xl hover:bg-[#1A3D63] disabled:opacity-50 transition-all text-sm shadow-md flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4 text-[#4AFAF7]" /> 
          {submitting ? 'Transmitting Proposal Pitch...' : 'Deploy Strategic Proposal'}
        </button>
      </form>
    </div>
  );
}
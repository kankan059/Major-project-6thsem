'use client';
import React, { useState } from 'react';
import { JobFormData } from '@/app/types/jobs';
import { Briefcase, X } from 'lucide-react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JobFormData) => Promise<void>;
}

export default function JobModal({ isOpen, onClose, onSubmit }: JobModalProps) {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    budget: '',
    category: 'Web Development',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit(formData);
    setSubmitting(false);
    setFormData({ title: '', description: '', budget: '', category: 'Web Development' });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white border border-[#BEB5A9] rounded-3xl w-full max-w-lg p-6 relative space-y-4 shadow-2xl text-[#6E473B]">
        
        <div className="flex items-center justify-between border-b border-[#E1D4C2] pb-3">
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#291CDE]" /> Define Project Specifications
          </h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#E1D4C2]/40 text-[#A78D78] hover:text-[#6E473B] transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A78D78] mb-1">Project Title</label>
            <input 
              type="text" required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2.5 border border-[#BEB5A9] rounded-xl bg-[#F6FAFD] text-[#6E473B] font-medium outline-none focus:ring-2 focus:ring-[#291CDE] transition-all text-sm"
              placeholder="e.g., Integrate Razorpay Checkout Gateway"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#A78D78] mb-1">DESCRIPTION</label>
            <textarea 
              required rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2.5 border border-[#BEB5A9] rounded-xl bg-[#F6FAFD] text-[#6E473B] font-medium outline-none focus:ring-2 focus:ring-[#291CDE] transition-all text-sm resize-none"
              placeholder="Provide explicit engineering definitions, deliverables, and framework boundaries..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A78D78] mb-1">PRICE (INR)</label>
              <input 
                type="number" required
                value={formData.budget}
                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#BEB5A9] rounded-xl bg-[#F6FAFD] text-[#6E473B] font-medium outline-none focus:ring-2 focus:ring-[#291CDE] transition-all text-sm"
                placeholder="12000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A78D78] mb-1">Project Category</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-4 py-2.5 border border-[#BEB5A9] rounded-xl bg-[#F6FAFD] text-[#6E473B] font-bold outline-none focus:ring-2 focus:ring-[#291CDE] transition-all text-sm h-[42px]"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile Applications">Mobile Applications</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" disabled={submitting}
              className="w-full py-3 bg-[#291CDE] text-white font-extrabold rounded-xl hover:opacity-90 transition-all text-sm shadow-lg shadow-[#291CDE]/20 disabled:opacity-50"
            >
              {submitting ? 'Deploying Specifications...' : 'Deploy Project Blueprint to Marketplace'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
} 
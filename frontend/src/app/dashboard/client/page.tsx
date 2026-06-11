'use client';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '@/hooks/useAuth';
import { setClientJobs, setJobLoading } from '@/redux/slices/jobSlices';
import { RootState, AppDispatch } from '@/redux/store';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { Job, JobFormData } from '@/app/types/jobs';
import JobCard from '@/components/JobCard';
import JobModal from '@/components/client/JobModel';
import { Plus, FolderOpen, RefreshCw, X, Star, MessageSquare, CheckCircle } from 'lucide-react';

interface BackendErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ClientDashboardMaster() {
  const dispatch = useDispatch<AppDispatch>();
  const { isClient, isAuthenticated } = useAuth();
  const { clientJobs, loading } = useSelector((state: RootState) => state.jobs);
  
  const [activeTab, setActiveTab] = useState<'open' | 'active' | 'under_review' | 'completed'>('open');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Rating Modal States
  const [isRatingOpen, setIsRatingOpen] = useState<boolean>(false);
  const [activeJobId, setActiveJobId] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submittingRating, setSubmittingRating] = useState<boolean>(false);

  // Core Data Synchronization Pipeline Trigger Loop
  const fetchClientContracts = async (): Promise<void> => {
    dispatch(setJobLoading(true));
    try {
      const res = await api.get<Job[]>('/jobs/client-owned'); 
      if (res.data && Array.isArray(res.data)) {
        dispatch(setClientJobs(res.data));
      }
    } catch (error: unknown) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Failed to sync platform parameters.');
    } finally {
      dispatch(setJobLoading(false));
    }
  };

  useEffect(() => {
    if (isAuthenticated && isClient) {
      fetchClientContracts();
    }
  }, [isAuthenticated, isClient]);

  // Fixed & Declared: Strict post job handle structure
  const handlePostJob = async (data: JobFormData): Promise<void> => {
    try {
      const payload = {
        title: data.title,
        description: data.description,
        budget: Number(data.budget),
        category: data.category,
      };

      await api.post<Job>('/jobs', payload);
      toast.success('Project configuration successfully registered.');
      setIsModalOpen(false);
      await fetchClientContracts();
    } catch (error: unknown) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Database transaction verification failed.');
    }
  };

  // Handle Direct Job Completion (Review Pending Tab)
  const handleDirectJobCompletion = async (jobId: string): Promise<void> => {
    try {
      await api.put(`/jobs/complete-status/${jobId}`);
      toast.success('Job marked as completed. Funds released!');
      setActiveTab('completed'); 
      await fetchClientContracts();
    } catch (error: unknown) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Failed to complete job.');
    }
  };

  // Handle Rating Submission (Completed Tab)
  const handleRatingSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmittingRating(true);
    try {
      await api.put(`/jobs/submit-rating/${activeJobId}`, { rating, comment });
      toast.success('Thank you! Freelancer rating logged.');
      setIsRatingOpen(false);
      await fetchClientContracts();
    } catch (error: unknown) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmittingRating(false);
    }
  };

  const filteredJobs: Job[] = clientJobs.filter((job: Job) => {
    if (!job || !job.status) return false;
    return job.status.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div className="min-h-screen bg-[#E1D4C2] text-[#6E473B] font-sans pb-24 md:pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* BANNER */}
        <div className="bg-[#6E473B] border border-[#A78D78] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl text-[#E1D4C2]">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-white">Enterprise Procurement Hub</h1>
            <p className="text-[#BEB5A9] text-sm font-medium">Verify bids, access ongoing workflows, and execute contract closures.</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="hidden md:flex items-center gap-2 bg-[#291CDE] text-white text-sm font-bold px-5 py-3 rounded-xl hover:opacity-90 shadow-md transition-all duration-200">
            <Plus className="h-4 w-4" /> Post New Specification
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-[#BEB5A9] gap-2 overflow-x-auto pb-1 scrollbar-none">
          {(['open', 'active', 'under_review', 'completed'] as const).map((tab) => {
            const dynamicCounter = clientJobs.filter((j: Job) => j.status?.toLowerCase() === tab.toLowerCase()).length;
            let tabLabelString = tab + " Projects";
            if (tab === 'under_review') tabLabelString = "Review Pending";

            return (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); fetchClientContracts(); }}
                className={`px-4 py-3 text-xs sm:text-sm font-black tracking-wider uppercase border-b-2 whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab ? 'border-[#291CDE] text-[#291CDE]' : 'border-transparent text-[#A78D78] hover:text-[#6E473B]'
                }`}
              >
                {tabLabelString} ({dynamicCounter})
              </button>
            );
          })}
        </div>

        {/* GRID NODE CONTAINER */}
        {loading ? (
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#A78D78] animate-pulse uppercase">
            <RefreshCw className="h-4 w-4 animate-spin" /> Querying central registries...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#BEB5A9] rounded-3xl text-center bg-white/40 max-w-xl mx-auto space-y-4 shadow-sm">
            <FolderOpen className="h-12 w-12 text-[#A78D78]" />
            <h3 className="font-bold text-lg text-[#6E473B]">No Operational Documents Located</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {filteredJobs.map((job: Job) => (
              <div key={job._id} className="relative group bg-white rounded-2xl shadow-sm p-1 border border-neutral-100 flex flex-col justify-between">
                <JobCard job={job} />
                

                {/* 2. BUTTON INSIDE COMPLETED TAB */}
                {activeTab === 'completed' && (
                  <div className="p-4 pt-0 border-t border-neutral-50 mt-2 flex justify-end">
                    <button
                      onClick={() => { setActiveJobId(job._id); setIsRatingOpen(true); setRating(5); setComment(''); }}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Star className="h-3.5 w-3.5" /> Rate Freelancer
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* POST JOB MODAL CONTEXT */}
        <JobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handlePostJob} />

        {/* --- INLINE COMPLETED POST RATING MODAL --- */}
        {isRatingOpen && (
          <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 text-left animate-fadeIn">
            <div className="w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 space-y-6 relative text-neutral-800 border border-neutral-200 shadow-2xl">
              <button type="button" onClick={() => setIsRatingOpen(false)} className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600 cursor-pointer"><X className="h-4 w-4" /></button>
              
              <div className="text-center space-y-1">
                <h3 className="text-lg font-extrabold text-[#0A1931]">Leave a Review</h3>
                <p className="text-xs text-neutral-400 font-medium">Rate the freelancer&apos;s overall milestone performance.</p>
              </div>

              <form onSubmit={handleRatingSubmit} className="space-y-5">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star} type="button" onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                      >
                        <Star className={`h-7 w-7 ${star <= (hoverRating || rating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> Feedback Text</label>
                  <textarea
                    value={comment} onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your reference endorsement log here..." rows={3}
                    className="w-full text-sm text-neutral-700 bg-[#F8FAFC] border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#0A1931] resize-none"
                  />
                </div>

                <button type="submit" disabled={submittingRating} className="w-full py-3 bg-[#0A1931] text-white font-bold text-xs uppercase tracking-widest rounded-xl disabled:opacity-50 cursor-pointer shadow-sm">
                  {submittingRating ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Lock Public Feedback'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
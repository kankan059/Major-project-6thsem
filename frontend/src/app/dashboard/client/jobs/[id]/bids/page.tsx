'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { updateJobStatus } from '@/redux/slices/jobSlices';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { Bid } from '@/app/types/bids';
import { ArrowLeft, Inbox, User, CheckCircle, RefreshCw } from 'lucide-react';
import FreelancerProfileModal from '@/components/freelancer/FreelancerProfileModal';

export default function EvaluateBidsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isClient, isAuthenticated } = useAuth();

  const [selectedFreelancerId, setSelectedFreelancerId] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // Trigger profile modal handler matrix
  const triggerProfileModal = (freelancerId: string): void => {
    setSelectedFreelancerId(freelancerId);
    setIsProfileOpen(true);
  };

  useEffect(() => {
    const fetchProjectBids = async () => {
      try {
        const res = await api.get(`/bids/${id}`);
        setBids(res.data);
      } catch (error: unknown) {
        toast.error('Failed to retrieve submitted contract applications from server.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && isClient) fetchProjectBids();
  }, [id, isAuthenticated, isClient]);

  // Combined real accept bid workflow integration layer
  const handleAcceptBid = async (bidId: string) => {
    setProcessingId(bidId);
    try {
      const payload = { jobId: id, bidId };
      await api.post('/bids/accept-bid', payload);
      dispatch(updateJobStatus({ jobId: id as string, status: 'active' }));
      toast.success('Contract finalized successfully! Workspace environment provisioned.');
      router.push('/dashboard/client');
    } catch (error: unknown) {
      const errorMessage = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(errorMessage || 'Transaction authorization loop failed.');
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E1D4C2] text-[#6E473B] flex items-center justify-center">
        <p className="text-sm font-bold tracking-widest animate-pulse uppercase text-[#A78D78]">Parsing Pitch Matrices...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E1D4C2] text-[#6E473B] font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto p-4 sm:p-8 space-y-6">

        {/* Navigation Action Hook */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold uppercase text-[#A78D78] hover:text-[#6E473B] transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Workspace
        </button>

        {/* Content Profile Header */}
        <div className="border-b border-[#BEB5A9] pb-5">
          <h1 className="text-3xl font-black tracking-tight">Evaluate Project Pitches</h1>
          <p className="text-sm text-[#A78D78] font-medium mt-1">Review independent engineers, audit baseline structural strategies, and bind contracts.</p>
        </div>

        {/* Data Mapping Node */}
        {bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#BEB5A9] rounded-3xl text-center bg-white/40 max-w-md mx-auto space-y-3">
            <Inbox className="h-10 w-10 text-[#A78D78]" />
            <div>
              <h3 className="font-bold text-[#6E473B]">No Proposals Received</h3>
              <p className="text-xs text-[#A78D78] font-medium mt-0.5">This project link has not collected any active contractor pitches yet.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bids.map((bid) => {
              // Extract accurate freelancer ID whether it is populated as object or raw string
              const freelancerId = typeof bid.freelancer === 'object' 
                ? (bid.freelancer as { _id: string; name: string })._id 
                : bid.freelancer;
                
              const freelancerName = typeof bid.freelancer === 'object' 
                ? (bid.freelancer as { _id: string; name: string }).name 
                : 'Independent Contractor';

              return (
                <div 
                  key={bid._id} 
                  className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    {/* CLICKABLE PROFILE ICON HANDLER MATRIX */}
                    <div 
                      onClick={() => freelancerId && triggerProfileModal(freelancerId)}
                      className="h-10 w-10 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 flex items-center justify-center text-[#0A1931] cursor-pointer transition-all"
                    >
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 
                        onClick={() => freelancerId && triggerProfileModal(freelancerId)}
                        className="font-bold text-sm text-[#0A1931] hover:underline cursor-pointer"
                      >
                        {freelancerName}
                      </h4>
                      <p className="text-xs text-neutral-400 font-medium">
                        Bid Amount: ₹{bid.bidAmount?.toLocaleString('en-IN') || '0'}
                      </p>
                    </div>
                  </div> 

                  <button
                    onClick={() => handleAcceptBid(bid._id)}
                    disabled={processingId !== null}
                    className="px-4 py-2 bg-[#0A1931] text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-[#122b52] transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {processingId === bid._id ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <CheckCircle className="h-3.5 w-3.5" />
                    )}
                    {processingId === bid._id ? 'Processing...' : 'Accept Proposal'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* RENDER MODAL OVERLAY IN BACKGROUND CORE PIPELINE */}
      <FreelancerProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        freelancerId={selectedFreelancerId}
      />
    </div>
  );
}
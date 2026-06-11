'use client';
import React, { useEffect, useState } from 'react';
import { X, Star, User, MessageSquare, RefreshCw } from 'lucide-react';
import { FreelancerProfileDetails } from '@/app/types/profile';
import { toast } from 'react-toastify';
import api from '@/utils/api';

interface FreelancerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerId: string;
}

export default function FreelancerProfileModal({ isOpen, onClose, freelancerId }: FreelancerProfileModalProps) {
  const [profile, setProfile] = useState<FreelancerProfileDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Agar modal closed hai ya valid freelancerId missing hai, toh execution block karein
    if (!isOpen || !freelancerId) return;

    const fetchFreelancerPublicProfile = async (): Promise<void> => {
      setLoading(true);
      try {
        // Purely Dynamic API call to deep populate review nodes from cluster
        const res = await api.get<FreelancerProfileDetails>(`/users/profile/${freelancerId}`);
        setProfile(res.data);
      } catch (err: unknown) {
        // Reset profiling state on endpoint exception failures
        setProfile(null);
        
        const errorMessage = typeof err === 'object' && err !== null && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;

        toast.error(errorMessage || 'Failed to sync public profile metrics from database server.');
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerPublicProfile();
  }, [isOpen, freelancerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 sm:p-8 space-y-6 text-neutral-800 relative max-h-[85vh] overflow-y-auto scrollbar-none">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-xs font-mono font-bold text-neutral-400">
            <RefreshCw className="h-4 w-4 animate-spin text-[#0A1931]" />
            <span>RETRIEVING TRUST CREDENTIAL METRICS...</span>
          </div>
        ) : profile ? (
          <>
            {/* Header Profiler Core */}
            <div className="flex items-center gap-4 border-b border-neutral-100 pb-4">
              <div className="h-14 w-14 rounded-full bg-[#F1F5F9] border border-neutral-200 flex items-center justify-center text-[#0A1931]">
                <User className="h-6 w-6" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-lg font-extrabold text-[#0A1931]">{profile.name}</h3>
                <p className="text-xs text-neutral-400 font-medium">{profile.email}</p>
              </div>
            </div>

            {/* Score Indicators Block */}
            <div className="grid grid-cols-2 gap-4 bg-[#F8FAFC] border border-neutral-100 p-4 rounded-xl text-center">
              <div>
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Average Rating</span>
                <span className="text-xl font-black text-[#0A1931] flex items-center justify-center gap-1 mt-0.5">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" /> {profile.averageRating ?? '0.0'}
                </span>
              </div>
              <div className="border-l border-neutral-200">
                <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Feedback Logs</span>
                <span className="text-xl font-black text-[#0A1931] flex items-center justify-center gap-1 mt-0.5">
                  <MessageSquare className="h-4 w-4 text-neutral-400" /> {profile.totalReviews ?? 0}
                </span>
              </div>
            </div>

            {/* Historical Reviews Feed Section */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Historical Trust Endorsements</h4>
              {!profile.reviews || profile.reviews.length === 0 ? (
                <p className="text-xs text-neutral-400 font-medium italic py-2">No historical contract ratings logged yet.</p>
              ) : (
                <div className="space-y-3">
                  {profile.reviews.map((rev) => (
                    <div key={rev._id} className="p-3.5 bg-white border border-neutral-100 rounded-xl space-y-1.5 shadow-sm">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-[#0A1931]">{rev.from?.name || 'Enterprise Client'}</span>
                        <span className="text-amber-500 flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-amber-500" /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed italic">&apos;{rev.comment}&apos;</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center text-xs font-medium text-neutral-400 space-y-2">
            <span>No data layer profile found for this contractor index reference.</span>
          </div>
        )}

      </div>
    </div>
  );
}
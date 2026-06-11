
'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { Message, WorkspaceJobDetails } from '@/app/types/socket';
import ChatBox from '@/components/workspace/ChatBox';
import FreelancerSubmit from '@/components/freelancer/FreelancerSubmit';
import ClientReview from '@/components/client/ClientReview';

import { ArrowLeft, Briefcase, IndianRupee, Award, RefreshCw, ShieldAlert } from 'lucide-react';

interface BackendErrorResponse {
  response?: { status?: number; data?: { message?: string } };
}

export default function WorkspaceMasterPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const router = useRouter();
  const { user, isAuthenticated, isClient, isFreelancer } = useAuth();
  const socket = useSocket();

  const [jobDetails, setJobDetails] = useState<WorkspaceJobDetails | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);

  useEffect(() => {
    const bootstrapWorkspaceMemory = async () => {
      try {
        // FIX: Shared production bulletproof lookup path!
        // Client aur Freelancer dono isi single common validation endpoint ko query karenge
        const res = await api.get<WorkspaceJobDetails>(`/jobs/workspace-node/${jobId}`);
        
        if (res.data && res.data._id) {
          setJobDetails(res.data);
          setUnauthorized(false);
        }

        // Fetch valid chronological chat history records directly from database
        const messagesResponse = await api.get<Message[]>(`/messages/${jobId}`);
        if (messagesResponse.data && Array.isArray(messagesResponse.data)) {
          setChatHistory(messagesResponse.data);
        }
      } catch (error) {
        const err = error as BackendErrorResponse;
        if (err.response?.status === 403) {
          setUnauthorized(true);
        } else {
          toast.error(err.response?.data?.message || 'Database pipeline indexing latency timeout.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      bootstrapWorkspaceMemory();
    }
  }, [jobId, isAuthenticated]);

  useEffect(() => {
    if (socket && socket.connected && user && jobDetails) {
      socket.emit('join_room', { jobId, userId: user.id });
    }
  }, [socket, user, jobDetails, jobId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] flex flex-col items-center justify-center font-mono text-xs font-bold text-neutral-400 gap-2">
        <RefreshCw className="h-4 w-4 animate-spin text-[#0A1931]" />
        <span>SYNCING CENTRAL SANDBOX CONTRACT METADATA...</span>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] flex items-center justify-center p-4">
        <div className="bg-white border border-red-200 p-8 rounded-3xl max-w-md text-center space-y-4 shadow-xl text-[#0A1931]">
          <ShieldAlert className="h-10 w-10 text-red-500 mx-auto animate-pulse" />
          <h2 className="text-xl font-black tracking-tight">Access Token Revoked</h2>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed">
            Your authenticated unique identity key is not tied to this localized transaction. Verification failed.
          </p>
          <button 
            onClick={() => router.push(isClient ? '/dashboard/client' : '/dashboard/freelancer')}
            className="px-4 py-2 bg-[#0A1931] text-white font-bold rounded-lg text-xs"
          >
            Back to Dashboard Hub
          </button>
        </div>
      </div>
    );
  }

  if (!jobDetails || !user) return null;

  return (
    <div className="min-h-screen bg-[#F6FAFD] text-[#0A1931] font-sans pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400 hover:text-[#0A1931] transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Exit Environment Workspace
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* CONTROL BOX PANEL */}
          <div className="space-y-6">
            <div className="bg-white border border-[#B3CFE5]/40 rounded-2xl p-6 space-y-4 shadow-sm">
              <span className="text-[10px] font-mono font-black uppercase bg-[#1A3D63] text-[#4AFAF7] px-2.5 py-1 rounded-md">
                Active Specification
              </span>
              <h2 className="text-xl font-black text-[#0A1931] leading-tight mt-2">{jobDetails.title}</h2>
              <p className="text-xs text-neutral-500 font-medium whitespace-pre-wrap leading-relaxed">
                {jobDetails.description}
              </p>
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-400">
                VALUATION: 
                <span className="text-sm font-black text-[#0A1931] flex items-center">
                  <IndianRupee className="h-3.5 w-3.5" /> {jobDetails.budget.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {jobDetails.status === 'active' && isFreelancer && (
              <FreelancerSubmit 
                onSubmittingWork={async (notes, url) => {
                  try {
                    await api.post(`/jobs/${jobId}/submit`, { deliveryNotes: notes, fileUrl: url });
                    toast.success('Work blueprint delivered under active evaluation loop.');
                    setJobDetails(prev => prev ? { ...prev, status: 'under_review' } : null);
                  } catch (err) {
                    toast.error('Failed to pipe code payload mapping metrics.');
                  }
                }}
              />
            )}

            {jobDetails.status === 'under_review' && isClient && (
              <ClientReview 
                jobId={jobId} 
                budget={jobDetails.budget} 
                onApproveSuccess={() => {
                  toast.success('Escrow released successfully! Project closed.');
                  setJobDetails(prev => prev ? { ...prev, status: 'completed' } : null);
                }}
              />
            )}

            {jobDetails.status === 'under_review' && isFreelancer && (
              <div className="bg-white border border-amber-200 rounded-2xl p-6 text-center space-y-2 shadow-sm bg-amber-50/20">
                <p className="text-sm font-bold text-amber-700">⏳ Verification Pending</p>
                <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                  The client has been notified to audit documentation matrices and release the locked fund milestones.
                </p>
              </div>
            )}

            {jobDetails.status === 'completed' && (
              <div className="bg-gradient-to-br from-green-900 to-[#455A4F] text-white rounded-2xl p-6 text-center space-y-2 shadow-xl border border-green-500/20">
                <Award className="h-8 w-8 text-[#4AFAF7] mx-auto animate-pulse" />
                <h3 className="font-black text-sm">Contract Concluded Successfully</h3>
                <p className="text-[10px] text-[#D9DCD6] font-medium leading-relaxed">
                  Milestone clear-outs verified. Project nodes archived cleanly.
                </p>
              </div>
            )}
          </div>

          {/* MESSAGE PLATFORM BOX COMPONENTS */}
          <div className="lg:col-span-2">
            <ChatBox 
              jobId={jobId} 
              currentUserId={user.id} 
              socket={socket} 
              initialMessages={chatHistory} 
            />
          </div>

        </div>

      </div>
    </div>
  );
}
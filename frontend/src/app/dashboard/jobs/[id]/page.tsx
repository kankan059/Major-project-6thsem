'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { SingleJobConfig, ProposalSubmitData, BackendErrorResponse } from '@/app/types/jobs';
import ProposalForm from '@/components/ProposalForm';
import { ArrowLeft, Tag, Calendar, User, IndianRupee, ShieldCheck } from 'lucide-react';

export default function DynamicJobDetailsMaster() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isFreelancer, isAuthenticated } = useAuth();

  const [job, setJob] = useState<SingleJobConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSpecification = async (): Promise<void> => {
      try {
        // Hits backend router.get('/', protect, getAllJobs) code from your setup
        const res = await api.get<SingleJobConfig[]>('/jobs');
        const targetConfig = res.data.find((j: SingleJobConfig) => j._id === id);
        
        if (!targetConfig) {
          toast.error('Project blueprint target metadata missing.');
          router.push('/dashboard/jobs');
          return;
        }
        setJob(targetConfig);
      } catch (error) {
        const err = error as BackendErrorResponse;
        toast.error(err.response?.data?.message || 'Failed to sync endpoint specs.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSpecification();
    }
  }, [id, isAuthenticated, router]);

  const handleProposalSubmission = async (data: ProposalSubmitData): Promise<void> => {
    try {
      const payload = {
        jobId: id,
        bidAmount: Number(data.bidAmount),
        estimatedDays: Number(data.estimatedDays),
        proposalText: data.proposalText,
      };

      // Hits router.post('/', protect, placeBid) endpoint precisely
      await api.post('/bids', payload);
      toast.success('Your strategic proposal has been transmitted to Client Console.');
      router.push('/dashboard/freelancer');
    } catch (error) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Database server rejected structural bid allocation.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] flex items-center justify-center font-mono text-xs font-bold text-neutral-400 animate-pulse uppercase">
        Parsing Contract Architecture Specs...
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen bg-[#F6FAFD] text-[#0A1931] font-sans pb-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-6">
        
        {/* Navigation Action Hook */}
        <button 
          onClick={() => router.push('/dashboard/jobs')}
          className="flex items-center gap-1.5 text-xs font-bold uppercase text-neutral-400 hover:text-[#0A1931] transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Market Feed
        </button>

        {/* Contract Scope Container Details */}
        <div className="bg-white border border-[#B3CFE5]/30 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1 font-mono bg-[#1A3D63] text-[#4AFAF7] px-2.5 py-1 rounded-lg font-bold uppercase">
              <Tag className="h-3 w-3" /> {job.category}
            </span>
            <span className="text-neutral-400 flex items-center gap-1 font-medium">
              <Calendar className="h-3.5 w-3.5" /> Published: {new Date(job.createdAt).toLocaleDateString()}
            </span>
            <span className="text-neutral-400 flex items-center gap-1 font-medium">
              <User className="h-3.5 w-3.5 text-[#1A3D63]" /> Sourced by {job.client?.name}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">{job.title}</h1>
          <div className="h-px bg-[#B3CFE5]/20 my-2" />
          
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">Project Definition</h4>
            <p className="text-sm text-neutral-600 font-medium whitespace-pre-wrap leading-relaxed">
              {job.description}
            </p>
          </div>

          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-neutral-400 block">Base Price</span>
              <span className="text-xl font-black flex items-center text-[#0A1931] mt-0.5">
                <IndianRupee className="h-4.5 w-4.5" /> {job.budget.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold font-mono text-green-600 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg uppercase">
              <ShieldCheck className="h-4 w-4" /> Status: {job.status}
            </div>
          </div>
        </div>

        {/* Conditional Logic: Form is purely active for Freelancers only */}
        {isFreelancer && (
          <ProposalForm onSubmit={handleProposalSubmission} />
        )}

      </div>
    </div>
  );
}
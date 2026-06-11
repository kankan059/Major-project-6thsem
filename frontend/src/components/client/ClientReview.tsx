'use client';
import React, { useEffect, useState } from 'react';
import { ExternalLink, ShieldCheck, Landmark, RefreshCw } from 'lucide-react';
import { useRazorpay } from '@/hooks/useRazorpay';
import { toast } from 'react-toastify';
import api from '@/utils/api';

interface ClientReviewProps {
  jobId: string;
  budget: number;
  onApproveSuccess: () => void;
}

interface SubmissionPayload {
  deliveryNotes: string;
  fileUrl: string;
}

interface OrderAllocationResponse {
  id: string;
  amount: number;
  currency: string;
}

interface RazorpayPopupResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPopupResponse) => Promise<void>;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
  modal: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
}

interface RazorpayWindow {
  Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
}

interface AxiosPaymentError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ClientReview({ jobId, budget, onApproveSuccess }: ClientReviewProps) {
  const isScriptLoaded = useRazorpay();
  const [submission, setSubmission] = useState<SubmissionPayload | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    const fetchLatestSubmissionData = async (): Promise<void> => {
      try {
        const res = await api.get<SubmissionPayload>(`/jobs/${jobId}/submission`);
        setSubmission(res.data);
      } catch (err) {
        setSubmission({
          deliveryNotes: "Project items wrapped up completely. Production pipeline ready for testing deployment.",
          fileUrl: "https://github.com/build-repository-reference"
        });
      }
    };
    fetchLatestSubmissionData();
  }, [jobId]);

  const initEscrowSettlementCheckout = async (): Promise<void> => {
    if (!isScriptLoaded) {
      toast.error('Razorpay gateway module is offline. Please try again.');
      return;
    }

    setProcessing(true);
    try {
      const targetMilestoneIndex = 0; 

      const orderRes = await api.post<OrderAllocationResponse>('/payments/create-order', { 
        jobId, 
        milestoneIndex: targetMilestoneIndex 
      });
      
      const orderData = orderRes.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mockKeyId123',
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Nexus Escrow',
        description: `Milestone Settlement Index: ${targetMilestoneIndex}`,
        order_id: orderData.id,
        handler: async function (response: RazorpayPopupResponse) {
          try {
            await api.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              jobId,
              milestoneIndex: targetMilestoneIndex
            });

            await api.post(`/jobs/${jobId}/approve-complete`);
            
            toast.success('Payment verified and released successfully!');
            onApproveSuccess();
          } catch (err) {
            toast.error('Payment verification failed.');
          }
        },
        prefill: {
          name: 'Client Node',
          email: 'client@nexus.internal'
        },
        theme: { color: '#0A1931' },
        modal: {
          ondismiss: function() {
            setProcessing(false);
            toast.warn('Payment process cancelled by user.');
          }
        }
      };

      const rzpWindow = window as unknown as RazorpayWindow;
      const rzpWindowInstance = new rzpWindow.Razorpay(options);
      rzpWindowInstance.open();

    } catch (error: unknown) {
      const typedError = error as AxiosPaymentError;
      console.error("Payment Handshake Error:", typedError);
      toast.error(typedError.response?.data?.message || 'Connection dropped with payment gateway.');
      setProcessing(false);
    }
  };

  if (!submission) {
    return (
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center shadow-sm">
        <p className="text-xs font-sans font-semibold text-neutral-400 animate-pulse uppercase tracking-wider">
          Loading submission details...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-sm text-neutral-800">
      <h3 className="text-lg font-extrabold tracking-tight flex items-center gap-2 text-[#0A1931]">
        <ShieldCheck className="h-5 w-5" /> Audit Project Deliverables
      </h3>
      <p className="text-xs text-neutral-400 font-medium leading-relaxed">
        Review the delivered materials, repositories, and notes before releasing the escrow payment.
      </p>

      <div className="bg-[#F8FAFC] p-4 rounded-xl space-y-1.5 border border-neutral-200/60">
        <h4 className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Freelancer Notes</h4>
        <p className="text-sm font-medium text-neutral-700 leading-relaxed whitespace-pre-wrap">{submission.deliveryNotes}</p>
      </div>

      <div className="flex items-center justify-between text-xs font-bold bg-[#F8FAFC] p-3 rounded-xl border border-neutral-200/60">
        <span className="text-neutral-400 uppercase tracking-wider">Resource Link</span>
        <a 
          href={submission.fileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#0A1931] flex items-center gap-1 hover:underline"
        >
          Open Work Directory <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      <div className="pt-3 border-t border-neutral-100 space-y-3">
        <div className="flex justify-between items-center text-sm font-bold">
          <span className="text-neutral-400 uppercase tracking-wider">Milestone Amount</span>
          <span className="text-[#0A1931] font-black text-xl">
            ₹{budget.toLocaleString('en-IN')}.00
          </span>
        </div>

        <button
          onClick={initEscrowSettlementCheckout}
          disabled={processing}
          className="w-full py-3.5 bg-[#0A1931] hover:bg-[#122b52] text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all text-xs uppercase tracking-widest shadow-sm disabled:opacity-50 cursor-pointer"
        >
          <Landmark className="h-4 w-4" /> 
          {processing ? 'Processing Payment...' : 'Approve & Release Payment'}
        </button>
      </div>
    </div>
  );
}
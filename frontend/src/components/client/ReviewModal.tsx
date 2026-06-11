'use client';
import React, { useState } from 'react';
import { Star, X, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onReviewSubmittedSuccessfully: () => void;
}

interface AxiosReviewError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export default function ReviewModal({ isOpen, onClose, jobId, onReviewSubmittedSuccessfully }: ReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleReviewFormSubmission = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Aligned exactly with your backend req.body parameters
      await api.post('/reviews/submit', {
        jobId,
        rating,
        comment
      });

      toast.success('Review submitted successfully! Freelancer metrics updated.');
      onReviewSubmittedSuccessfully();
      onClose();
    } catch (err: unknown) {
      const typedError = err as AxiosReviewError;
      toast.error(typedError.response?.data?.message || 'Failed to submit review configuration.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 sm:p-8 space-y-5 text-neutral-800 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 text-left">
          <h3 className="text-lg font-extrabold tracking-tight text-[#0A1931]">
            Evaluate Freelancer Performance
          </h3>
          <p className="text-xs text-neutral-400 font-medium">
            Share your experience to help the community build trust.
          </p>
        </div>

        <form onSubmit={handleReviewFormSubmission} className="space-y-4">
          <div className="flex flex-col items-center justify-center py-2 space-y-2 bg-[#F8FAFC] rounded-xl border border-neutral-100">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Assign Rating Score</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  className={`h-6 w-6 cursor-pointer transition-all duration-150 ${
                    index <= (hoverRating || rating)
                      ? 'text-amber-400 fill-amber-400 scale-110'
                      : 'text-neutral-300'
                  }`}
                  onClick={() => setRating(index)}
                  onMouseEnter={() => setHoverRating(index)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Comment</label>
            <textarea
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="Describe code quality, communication, and milestone timeline delivery..."
              rows={3}
              className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0A1931] hover:bg-[#122b52] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {submitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Submit Review'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
'use client';
import React, { useState } from 'react';
import { X, Star, RefreshCw, MessageSquare } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '@/utils/api';

interface JobCompletionReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  onSuccess?: () => void;
}

export default function JobCompletionReviewModal({ isOpen, onClose, jobId, onSuccess }: JobCompletionReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleReviewSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Direct integration hit with backend rating mechanics
      await api.put(`/jobs/approve-complete/${jobId}`, {
        rating,
        comment: comment.trim() || 'Project completed successfully!'
      });

      toast.success('Escrow released and rating submitted successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error("Submission error:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete job transaction.';
      const apiErrorMessage = typeof error === 'object' && error !== null && 'response' in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      toast.error(apiErrorMessage || errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl border border-neutral-200 shadow-xl p-6 sm:p-8 space-y-6 text-neutral-800 relative">
        
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-600 transition-colors focus:outline-none cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="space-y-1 text-center">
          <h3 className="text-lg font-extrabold text-[#0A1931]">Approve & Rate Freelancer</h3>
          <p className="text-xs text-neutral-400 font-medium">
            This will release the escrow milestone funds into the freelancer&apos;s wallet. Please endorse their work.
          </p>
        </div>

        <form onSubmit={handleReviewSubmit} className="space-y-5 text-left">
          
          {/* Interactive Star Selection Engine */}
          <div className="space-y-2 flex flex-col items-center justify-center">
            <label className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Assign Score / Rating</label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="focus:outline-none cursor-pointer transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-7 w-7 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-neutral-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-xs font-bold text-neutral-500 mt-1">
              {rating === 5 ? '⭐ Excellent Work' : rating === 4 ? '⭐ Very Good' : rating === 3 ? '⭐ Good / Satisfactory' : rating === 2 ? '⭐ Needs Improvement' : '⭐ Poor Execution'}
            </span>
          </div>

          {/* Feedback Input Field */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> Client Endorsement / Review Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this contractor..."
              rows={3}
              className="w-full text-sm text-neutral-700 bg-[#F8FAFC] border border-neutral-200 rounded-xl p-3 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all resize-none font-medium"
            />
          </div>

          {/* Submit Button Trigger */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-[#0A1931] hover:bg-[#122b52] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
          >
            {submitting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Release Funds & Log Feedback'
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
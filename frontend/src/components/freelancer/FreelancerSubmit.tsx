'use client';
import React, { useState } from 'react';
import { UploadCloud, Link as LinkIcon, Send } from 'lucide-react';

interface FreelancerSubmitProps {
  onSubmittingWork: (deliveryNotes: string, fileUrl: string) => Promise<void>;
}

export default function FreelancerSubmit({ onSubmittingWork }: FreelancerSubmitProps) {
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!deliveryNotes.trim() || !fileUrl.trim()) return;

    setLoading(true);
    try {
      await onSubmittingWork(deliveryNotes.trim(), fileUrl.trim());
      setDeliveryNotes('');
      setFileUrl('');
    } catch (error) {
      console.error('Submission pipeline execution failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#B3CFE5]/40 rounded-2xl p-6 space-y-4 shadow-sm text-[#0A1931]">
      <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
        <UploadCloud className="h-5 w-5 text-[#1A3D63]" /> Deploy Final Deliverables
      </h3>
      <p className="text-xs text-neutral-400 font-medium leading-relaxed">
        Provide production repository references, cloud bucket parameters, or configuration access keys for structural client audits.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Handover Documentation
          </label>
          <textarea
            required 
            rows={3}
            value={deliveryNotes}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDeliveryNotes(e.target.value)}
            placeholder="Outline build logs, configuration keys, structural parameters, and execution blueprints..."
            className="w-full px-4 py-2.5 border border-[#B3CFE5]/40 rounded-xl bg-[#F6FAFD] text-sm font-medium text-[#0A1931] outline-none focus:ring-2 focus:ring-[#0A1931] resize-none leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-neutral-400 uppercase tracking-wider mb-1">
            Resource / Build File URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-3.5 h-4 w-4 text-neutral-400" />
            <input
              type="url" 
              required
              value={fileUrl}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileUrl(e.target.value)}
              placeholder="https://github.com/production-repo-link"
              className="w-full pl-9 pr-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-[#F6FAFD] text-sm font-medium text-[#0A1931] outline-none focus:ring-2 focus:ring-[#0A1931]"
            />
          </div>
        </div>

        <button
          type="submit" 
          disabled={loading || !deliveryNotes.trim() || !fileUrl.trim()}
          className="w-full py-3.5 bg-[#0A1931] text-white rounded-xl hover:bg-[#1A3D63] transition-all flex items-center justify-center gap-2 font-black shadow-md shadow-[#0A1931]/10 disabled:opacity-40 text-sm"
        >
          <Send className="h-4 w-4 text-[#4AFAF7]" />
          {loading ? 'Transmitting Build Data...' : 'Submit Work for Review'}
        </button>
      </form>
    </div>
  );
}
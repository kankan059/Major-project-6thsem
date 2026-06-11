'use client';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { MarketplaceJob, BackendErrorResponse } from '@/app/types/jobs';
import MarketplaceCard from '@/components/market/MarketCard';
import { Search, Briefcase, Compass, ShieldAlert } from 'lucide-react';

export default function GlobalJobsDashboard() {
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState<MarketplaceJob[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchMarketplace = async (): Promise<void> => {
      try {
        const res = await api.get<MarketplaceJob[]>('/jobs');
        
        const openListings = res.data.filter((job) => job.status === 'open');
        setJobs(openListings);
      } catch (error) {
        const err = error as BackendErrorResponse;
        toast.error(err.response?.data?.message || 'Could not fetch global market data logs.');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMarketplace();
    }
  }, [isAuthenticated]);

  // Clean runtime filter pipeline
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F6FAFD] flex items-center justify-center font-mono text-xs font-bold text-neutral-400 animate-pulse uppercase">
        Querying Open Market...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FAFD] text-[#0A1931] font-sans pb-12 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Marketplace Interactive Banner */}
        <div className="bg-[#0A1931] border border-[#1A3D63] text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-[#4AFAF7] font-mono text-[11px] font-bold tracking-widest uppercase mb-1">
              <Compass className="h-3.5 w-3.5" /> Discovery Grid
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">Global Contract Feed</h1>
            <p className="text-[#B3CFE5] text-sm font-medium">Audit active requests, isolate premium micro-budgets, and deploy bidding strategies.</p>
          </div>
        </div>

        {/* Search and Category Filter Interface Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 relative">
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-neutral-400" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contract blueprints by key phrases..."
              className="w-full pl-11 pr-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#0A1931] text-sm font-medium transition-all"
            />
          </div>

          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 border border-[#B3CFE5]/40 rounded-xl bg-white outline-none focus:ring-2 focus:ring-[#0A1931] text-sm font-bold h-[46px] text-[#0A1931]"
            >
              <option value="All">All Framework Domains</option>
              <option value="Web Development">Web Development</option>
              <option value="Mobile Applications">Mobile Applications</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
              <option value="Other">other</option>
            </select>
          </div>
        </div>

        {/* Results Stream Node Rendering */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold tracking-tight text-[#0A1931] flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#1A3D63]" /> Open Bidding Deployments ({filteredJobs.length})
          </h3>

          {filteredJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#B3CFE5]/40 rounded-3xl text-center bg-white/50 max-w-md mx-auto space-y-3 shadow-sm">
              <ShieldAlert className="h-10 w-10 text-neutral-300" />
              <div>
                <h4 className="font-bold text-[#0A1931]">No Matching Records</h4>
                <p className="text-xs text-neutral-400 font-medium mt-0.5">No open job specs match your search criteria or category filter.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredJobs.map((job: MarketplaceJob) => (
                <MarketplaceCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
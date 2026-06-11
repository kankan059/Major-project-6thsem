'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { 
  Users, 
  Briefcase, 
  Star, 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  MessageSquare,
  UserCheck
} from 'lucide-react';

interface ReviewNode {
  from: {
    name: string;
    email: string;
  } | string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'freelancer' | 'admin';
  averageRating?: number;
  totalReviews?: number;
  reviews?: ReviewNode[];
}

interface BackendErrorResponse {
  response?: { data?: { message?: string } };
}

export default function AdminControlHub() {
  const { isAdmin, isAuthenticated } = useAuth();
  
  // States Matrix
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'freelancer'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchAllUsersAdminData = async (): Promise<void> => {
    setLoading(true);
    try {
      // Backend api endpoint to fetch all users data for admin ledger
      const res = await api.get<UserProfile[]>('/admin/users');
      if (res.data && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (error: unknown) {
      const err = error as BackendErrorResponse;
      toast.error(err.response?.data?.message || 'Failed to sync admin ecosystem parameters.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    const initializeAdminUsers = async (): Promise<void> => {
      await fetchAllUsersAdminData();
    };

    void initializeAdminUsers();
  }, [isAuthenticated, isAdmin]);

  // Security Gate Guard check
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-center p-6 font-sans">
        <ShieldAlert className="h-12 w-12 text-rose-500 animate-bounce mb-2" />
        <h2 className="text-xl font-black text-[#0A1931]">Access Denied</h2>
        <p className="text-xs text-neutral-400 font-medium mt-1">This node route is strictly restricted to platform administrative clearance level.</p>
      </div>
    );
  }

  // Filter Logic Matrix
  const filteredUsers = users.filter((u: UserProfile) => {
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-neutral-800 font-sans antialiased pb-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP STATUS BANNER */}
        <div className="bg-[#0A1931] border border-neutral-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl text-white">
          <div className="space-y-1 text-left">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
              <UserCheck className="h-7 w-7 text-amber-400" /> Admin panel
            </h1>
            <p className="text-neutral-400 text-xs sm:text-sm font-medium">
              Monitor unified network accounts, evaluate user metrics, and audit live public feedback review ledgers.
            </p>
          </div>
          <button 
            onClick={fetchAllUsersAdminData}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Sync Directory
          </button>
        </div>

        {/* METRICS COUNTER CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Entities</p>
              <h3 className="text-xl font-black text-[#0A1931]">{users.length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Briefcase className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Active Clients</p>
              <h3 className="text-xl font-black text-neutral-800">{users.filter(u => u.role === 'client').length}</h3>
            </div>
          </div>
          <div className="bg-white p-5 border border-neutral-200 rounded-2xl flex items-center gap-4 shadow-sm text-left">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Star className="h-6 w-6" /></div>
            <div>
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Total Freelancers</p>
              <h3 className="text-xl font-black text-neutral-800">{users.filter(u => u.role === 'freelancer').length}</h3>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER INTERFACE CONTROLS */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border border-neutral-200 p-4 rounded-2xl shadow-sm">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <input 
              type="text"
              placeholder="Search user parameters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] transition-all font-medium"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
            {(['all', 'client', 'freelancer'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  roleFilter === role 
                    ? 'bg-[#0A1931] text-white border-[#0A1931] shadow-sm' 
                    : 'bg-white text-neutral-500 border-neutral-200 hover:text-neutral-800'
                }`}
              >
                {role === 'all' ? 'All Accounts' : role + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* DATA DIRECTORY MATRIX GRID */}
        {loading ? (
          <div className="flex items-center justify-center p-12 text-sm font-semibold text-neutral-500 gap-2">
            <RefreshCw className="h-5 w-5 animate-spin text-[#0A1931]" />
            <span>Parsing core network accounts directory ledger...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12 bg-white border border-neutral-200 rounded-2xl max-w-md mx-auto space-y-2 shadow-sm">
            <Users className="h-8 w-8 text-neutral-300 mx-auto" />
            <h4 className="font-bold text-neutral-700">No Registry Records Found</h4>
            <p className="text-xs text-neutral-400 font-medium">No matching accounts fit the specified criteria matrices.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredUsers.map((profile: UserProfile) => (
              <div key={profile._id} className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between text-left">
                
                {/* ACCOUNT PROFILE CONTAINER CARD */}
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <h3 className="font-extrabold text-base text-[#0A1931] tracking-tight">{profile.name}</h3>
                      <p className="text-xs text-neutral-400 font-mono font-semibold">{profile.email}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${
                      profile.role === 'admin' 
                        ? 'bg-rose-50 text-rose-600 border-rose-100'
                        : profile.role === 'freelancer'
                        ? 'bg-amber-50 text-amber-600 border-amber-100'
                        : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {profile.role}
                    </span>
                  </div>

                  {/* FREELANCER SPECIFIC RATING BLOCK COUNTERS */}
                  {profile.role === 'freelancer' && (
                    <div className="flex items-center gap-4 bg-[#F8FAFC] p-3 rounded-xl border border-neutral-100">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-amber-500" />
                        <span className="text-sm font-black text-neutral-700">{profile.averageRating || 0}</span>
                      </div>
                      <div className="text-xs font-semibold text-neutral-400 border-l border-neutral-200 pl-4 flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5 text-neutral-400" /> {profile.totalReviews || 0} Reviews Logged
                      </div>
                    </div>
                  )}

                  {/* LIVE USER REVIEWS LEDGER FEED */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Account Reviews History</h4>
                    
                    {!profile.reviews || profile.reviews.length === 0 ? (
                      <p className="text-xs text-neutral-400 font-medium italic pl-1">No transaction review modules archived on this account.</p>
                    ) : (
                      <div className="max-h-48 overflow-y-auto pr-1 space-y-2 border border-neutral-100 p-2.5 bg-[#F8FAFC]/50 rounded-xl scrollbar-thin">
                        {profile.reviews.map((rev: ReviewNode, index: number) => {
                          const reviewerName = typeof rev.from === 'object' && rev.from ? rev.from.name : 'System Client';
                          return (
                            <div key={index} className="bg-white border border-neutral-200 rounded-xl p-3 space-y-1 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-neutral-600 truncate">From: {reviewerName}</span>
                                <div className="flex items-center text-amber-500 gap-0.5 scale-90">
                                  <Star className="h-3 w-3 fill-amber-500" />
                                  <span className="text-xs font-black">{rev.rating}</span>
                                </div>
                              </div>
                              <p className="text-xs text-neutral-500 font-medium leading-relaxed pl-0.5">{rev.comment}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
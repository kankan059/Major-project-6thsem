'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/utils/api';
import { User, FileText, Tag, RefreshCw, Save, Landmark, Edit3, Eye } from 'lucide-react';

interface ProfileFields {
  name: string;
  bio: string;
  skills: string;
  upiId: string;
  accountNumber: string;
  ifscCode: string;
}

interface UserProfileResponse {
  name: string;
  email: string;
  bio?: string;
  skills?: string[];
  paymentDetails?: {
    upiId?: string;
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
  };
}

interface AxiosProfileError {
  response?: { data?: { message?: string } };
}

export default function MyProfileSettingsHub() {
  const { user } = useAuth();
  const [fields, setFields] = useState<ProfileFields>({ 
    name: '', 
    bio: '', 
    skills: '',
    upiId: '',
    accountNumber: '',
    ifscCode: ''
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditable, setIsEditable] = useState<boolean>(false);

  useEffect(() => {
    const fetchCurrentProfileData = async (): Promise<void> => {
      let activeUserId = '';

      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            activeUserId = parsedUser._id || parsedUser.id || '';
          } catch (e) {
          }
        }
      }

      if (!activeUserId || activeUserId === 'undefined') {
        activeUserId = user?.id || '';
      }

      if (!activeUserId || activeUserId === 'undefined') {
        if (user?.name) {
          setFields(prev => ({ ...prev, name: user.name || '' }));
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        // Direct hit to the API with our verified activeUserId
        const res = await api.get<UserProfileResponse>(`/users/profile/${activeUserId}`);
        if (res.data) {
          setFields({
            name: res.data.name || user?.name || '',
            bio: res.data.bio || '',
            skills: res.data.skills ? res.data.skills.join(', ') : '',
            upiId: res.data.paymentDetails?.upiId || '',
            accountNumber: res.data.paymentDetails?.accountNumber || '',
            ifscCode: res.data.paymentDetails?.ifscCode || ''
          });
        }
      } catch (err: unknown) {
        console.error("Profile fetch fallthrough:", err);
        setFields({ 
          name: user?.name || '', 
          bio: '', 
          skills: '',
          upiId: '',
          accountNumber: '',
          ifscCode: ''
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentProfileData();
  }, [user?.id, user?.name]);

  const handleProfileUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setSaving(true);

    try {
      const parsedSkillsArray = fields.skills
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s.length > 0);

      await api.put('/users/profile/update', {
        name: fields.name,
        bio: fields.bio,
        skills: parsedSkillsArray,
        paymentDetails: {
          upiId: fields.upiId,
          bankName: '',
          accountNumber: fields.accountNumber,
          ifscCode: fields.ifscCode.toUpperCase()
        }
      });

      toast.success('Profile updated successfully.');
      setIsEditable(false); 
    } catch (err: unknown) {
      const typedError = err as AxiosProfileError;
      toast.error(typedError.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center font-sans text-sm font-semibold text-neutral-500 gap-2">
        <RefreshCw className="h-5 w-5 animate-spin text-[#0A1931]" />
        <span>Loading your profile details...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 sm:p-8 text-neutral-800 font-sans antialiased">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-neutral-200 shadow-[0_8px_30px_rgb(0,0,0,0.03)] p-6 sm:p-10 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="space-y-1 text-left">
            <h2 className="text-xl font-extrabold tracking-tight text-[#0A1931]">
              My Profile Settings
            </h2>
            <p className="text-xs text-neutral-400 font-medium">
              {isEditable ? 'Modify your data parameters down below.' : 'Review your active public profile information overview.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer self-start sm:self-center ${
              isEditable 
                ? 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700' 
                : 'bg-[#0A1931] hover:bg-[#122b52] text-white shadow-sm'
            }`}
          >
            {isEditable ? (
              <>
                <Eye className="h-3.5 w-3.5" /> View Profile
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" /> Edit Details
              </>
            )}
          </button>
        </div>

        <form onSubmit={handleProfileUpdateSubmit} className="space-y-5">
          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Your Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              {isEditable ? (
                <input
                  type="text"
                  value={fields.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFields({ ...fields, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                  required
                />
              ) : (
                <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-700 font-semibold">
                  {fields.name || <span className="text-neutral-400 italic">No name provided</span>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">About Me / Bio</label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-4 h-4 w-4 text-neutral-400" />
              {isEditable ? (
                <textarea
                  value={fields.bio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFields({ ...fields, bio: e.target.value })}
                  placeholder="Tell us about yourself, your experience, or what you are looking for..."
                  rows={4}
                  className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium resize-none"
                />
              ) : (
                <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-600 font-medium whitespace-pre-wrap min-h-[100px]">
                  {fields.bio || <span className="text-neutral-400 italic">No professional bio description documented yet.</span>}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Skills</label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              {isEditable ? (
                <input
                  type="text"
                  value={fields.skills}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFields({ ...fields, skills: e.target.value })}
                  placeholder="e.g. React, Next.js, UI Design"
                  className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl pl-11 pr-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                />
              ) : (
                <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm flex flex-wrap gap-1.5">
                  {fields.skills ? (
                    fields.skills.split(',').map((skill, idx) => (
                      <span key={idx} className="bg-white border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
                        {skill.trim()}
                      </span>
                    ))
                  ) : (
                    <span className="text-neutral-400 italic">No skill tags listed.</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {user?.role === 'freelancer' && (
            <div className="pt-4 border-t border-neutral-100 space-y-4 text-left">
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                <Landmark className="h-4 w-4 text-neutral-500" /> Payout & Bank Settings
              </h4>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">UPI ID (Fast Transfer)</label>
                {isEditable ? (
                  <input
                    type="text"
                    value={fields.upiId}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFields({ ...fields, upiId: e.target.value })}
                    placeholder="username@okaxis"
                    className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                  />
                ) : (
                  <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-700 font-semibold">
                    {fields.upiId || <span className="text-neutral-400 italic">No UPI endpoint configured</span>}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">Account Number</label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={fields.accountNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFields({ ...fields, accountNumber: e.target.value })}
                      placeholder="919876543210"
                      className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium"
                    />
                  ) : (
                    <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-700 font-semibold">
                      {fields.accountNumber || <span className="text-neutral-400 italic">Not structured</span>}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">IFSC Code</label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={fields.ifscCode}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFields({ ...fields, ifscCode: e.target.value })}
                      placeholder="SBIN0001234"
                      className="w-full bg-[#F8FAFC] border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-[#0A1931] focus:bg-white transition-all font-medium uppercase"
                    />
                  ) : (
                    <div className="w-full bg-[#F8FAFC]/40 border border-neutral-100 rounded-xl px-4 py-3 text-sm text-neutral-700 font-bold uppercase">
                      {fields.ifscCode || <span className="text-neutral-400 italic">No IFSC code provided</span>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {isEditable && (
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 bg-[#0A1931] hover:bg-[#122b52] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm animate-fadeIn"
            >
              {saving ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" /> Save Changes
                </>
              )}
            </button>
          )}
        </form>

      </div>
    </div>
  );
}   
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardRedirector() {
    const router = useRouter();
    const { user, isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (isLoading) return;

        // Guard Clause: Agar logged in nahi hai, send to login
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Role-based route distribution
        if (user?.role === 'admin') {
            router.push('/dashboard/admin');
        } else if (user?.role === 'client') {
            router.push('/dashboard/client');
        } else if (user?.role === 'freelancer') {
            router.push('/dashboard/freelancer');
        }
    }, [user, isAuthenticated, isLoading, router]);

    // Premium Skeleton Loader View (Ready for GSAP or standard pulse)
    return (
        <div className="h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center bg-white dark:bg-neutral-950">
            <div className="space-y-4 text-center">
                <div className="w-12 h-12 border-4 border-t-indigo-600 border-neutral-200 dark:border-neutral-800 rounded-full animate-spin mx-auto"></div>
                <p className="text-sm font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                    Syncing Workspace...
                </p>
            </div>
        </div>
    );
}
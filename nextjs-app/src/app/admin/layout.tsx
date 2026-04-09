'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  if (!user) return null;

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h1 className="font-display text-3xl font-black text-gray-900">
          Admin Access Required
        </h1>
        <p className="text-gray-500 mt-2 max-w-md">
          You are signed in as <strong>{user.name}</strong> but this page is restricted to admin users only.
        </p>
        <p className="text-xs text-gray-400 mt-4">
          To grant admin access, open Firebase Console → Realtime Database → users/{user.uid} → add field <code>isAdmin: true</code>
        </p>
      </div>
    );
  }

  return <div className="min-h-screen bg-gray-50">{children}</div>;
}

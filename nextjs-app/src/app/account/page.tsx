'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { User, Phone, Mail, Tag, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-2xl px-4">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] p-8 text-white">
            <div className="w-20 h-20 rounded-full bg-[var(--color-amber)] text-gray-900 flex items-center justify-center text-3xl font-black mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-display text-3xl font-black">
              {user.name}
            </h1>
            {user.isAdmin && (
              <span className="inline-block mt-2 px-3 py-1 rounded-full bg-[var(--color-amber)] text-gray-900 text-xs font-bold">
                ⭐ ADMIN
              </span>
            )}
          </div>

          <div className="p-8 space-y-4">
            <Row icon={Mail} label="Email" value={user.email} />
            <Row icon={Phone} label="Phone" value={user.phone} />
            {user.interest && <Row icon={Tag} label="Interest" value={user.interest} />}
            <Row icon={Calendar} label="Joined" value={new Date(user.createdAt).toLocaleDateString('en-IN')} />

            <button
              onClick={signOut}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-red-200 text-red-700 font-bold hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={18} className="text-[var(--color-navy)] mt-0.5 flex-shrink-0" />
      <div>
        <div className="text-xs uppercase font-bold text-gray-500">{label}</div>
        <div className="text-gray-900">{value}</div>
      </div>
    </div>
  );
}

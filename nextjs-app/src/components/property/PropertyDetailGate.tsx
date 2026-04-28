'use client';

import { Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

export function PropertyDetailGate() {
  const { user, loading, openAuthModal } = useAuth();

  // Loading or logged in — show nothing (page renders normally)
  if (loading || user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(8px)' }}
    >
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 text-center">
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Lock size={28} className="text-[var(--color-amber)]" />
        </div>

        <h2 className="font-display text-2xl font-black text-gray-900 mb-2">
          Sign In to View Details
        </h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Create a free account to view full property details, photos, location map and contact our agents directly.
        </p>

        <button
          onClick={openAuthModal}
          className="w-full py-3.5 rounded-xl bg-[var(--color-amber)] text-gray-900 font-black text-sm hover:bg-[var(--color-amber-light)] transition-colors"
        >
          🔓 Sign Up Free — Instant Access
        </button>

        <p className="text-xs text-gray-400 mt-3">
          Already registered?{' '}
          <button onClick={openAuthModal} className="text-[var(--color-navy)] font-bold hover:underline">
            Sign in
          </button>
        </p>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck size={12} className="text-green-500" />
          Free forever · 500+ clients · Trusted since 2014
        </div>
      </div>
    </div>
  );
}

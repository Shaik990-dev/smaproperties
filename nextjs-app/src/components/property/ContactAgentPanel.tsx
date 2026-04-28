'use client';

import { Phone, MessageCircle, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { AGENTS } from '@/data/agents';
import { waLink, telLink } from '@/lib/utils';

export function ContactAgentPanel({ enquiryMsg }: { enquiryMsg: string }) {
  const { user, loading, openAuthModal } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-pulse space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-10 bg-gray-200 rounded" />
        <div className="h-10 bg-gray-200 rounded" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-3">
          <Lock size={26} className="text-[var(--color-amber)]" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">Contact Our Agents</h3>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Create a free account to get direct agent access — WhatsApp &amp; phone numbers revealed instantly.
        </p>
        <button
          onClick={openAuthModal}
          className="w-full py-3 rounded-xl bg-[var(--color-amber)] text-gray-900 font-black text-sm hover:bg-[var(--color-amber-light)] transition-colors"
        >
          🔓 Sign Up Free — It's Instant
        </button>
        <p className="text-xs text-gray-400 mt-3">
          Already have an account?{' '}
          <button onClick={openAuthModal} className="text-[var(--color-navy)] font-bold hover:underline">
            Sign in
          </button>
        </p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck size={12} className="text-green-500" />
          500+ clients · Trusted since 2014
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h3 className="font-bold text-gray-900 mb-1">📞 Contact Our Agents</h3>
      <p className="text-xs text-gray-500 mb-5">Get in touch directly via call or WhatsApp.</p>
      {AGENTS.map((a) => (
        <div key={a.name} className="mb-5 last:mb-0">
          <p className="font-semibold text-sm text-gray-900 mb-2">👤 {a.name}</p>
          <div className="flex flex-col gap-2">
            <a
              href={waLink(a.whatsapp, enquiryMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-wa)] text-white text-sm font-bold"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
            {a.phones.map((ph) => (
              <a
                key={ph}
                href={telLink(ph)}
                className="inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold"
              >
                <Phone size={14} /> {ph}
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

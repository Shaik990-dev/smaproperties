'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Home, MessageCircle } from 'lucide-react';
import { trackVisit } from '@/lib/visitors';
import { AGENTS } from '@/data/agents';
import { waLink } from '@/lib/utils';

export function Hero() {
  // Track visit anonymously — count is admin-only (visible in dashboard, not public)
  useEffect(() => {
    trackVisit('/');
  }, []);

  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex flex-col items-center justify-center text-center px-4 py-20 overflow-hidden"
      style={{
        background:
          'linear-gradient(150deg, var(--color-navy-dark) 0%, var(--color-navy) 40%, var(--color-navy-light) 100%)'
      }}
    >
      {/* Decorative radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(232,160,32,0.08) 0%, transparent 70%)'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-[var(--color-amber-light)] text-xs font-bold tracking-[2px] uppercase mb-6 fade-in">
          ✨ మాషా అల్లాహ్ · Nellore&apos;s Trusted Builders
        </div>

        <h1 className="font-display font-black text-white text-5xl sm:text-6xl lg:text-7xl leading-[1.05] fade-in">
          SMA <span className="block text-[var(--color-amber-light)]">Builders & Real Estates</span>
        </h1>

        <p className="mt-6 text-white/70 text-base sm:text-lg fade-in">
          Your Trusted Real Estate Partner in Nellore, Andhra Pradesh
        </p>
        <p className="mt-1 text-white/85 text-base fade-in">
          Layouts · Flats · Houses · Agricultural Land
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center fade-in">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg bg-[var(--color-amber)] text-gray-900 font-bold shadow-xl shadow-amber-500/30 hover:bg-[var(--color-amber-light)] hover:-translate-y-0.5 transition-all"
          >
            <Home size={18} /> View Properties
          </Link>
          <a
            href={waLink(AGENTS[0].whatsapp, 'Hi SMA Builders!')}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-lg border-2 border-white/50 text-white font-semibold hover:bg-white/10 transition-all"
          >
            <MessageCircle size={18} /> WhatsApp Us
          </a>
        </div>

        {/* Stats */}
        <div className="mt-12 flex flex-wrap justify-center gap-8 sm:gap-12 fade-in">
          <Stat n="500+" l="Happy Clients" />
          <Stat n="50+" l="Projects Done" />
          <Stat n="10+" l="Years Exp." />
          <Stat n="6+" l="Active Listings" />
        </div>

        {/* Chips */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 fade-in">
          {['🏘️ Layouts & Plots', '🏢 Flats & Apartments', '🏡 Houses', '🌾 Agricultural Land'].map((c) => (
            <span
              key={c}
              className="px-4 py-2 rounded-lg bg-white/[0.08] backdrop-blur-md border border-white/15 text-white/85 text-sm"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <div className="font-display text-3xl sm:text-4xl font-black text-[var(--color-amber-light)]">
        {n}
      </div>
      <div className="text-xs uppercase tracking-wider text-white/55 mt-1">{l}</div>
    </div>
  );
}

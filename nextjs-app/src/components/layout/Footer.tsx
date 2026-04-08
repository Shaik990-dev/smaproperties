import Link from 'next/link';
import { AGENTS, OFFICE } from '@/data/agents';
import { MapPin, Phone, Clock, MessageCircle } from 'lucide-react';
import { waLink, telLink } from '@/lib/utils';

export function Footer() {
  return (
    <footer className="bg-[var(--color-navy-dark)] text-white/80 py-16 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-2">
          <h3 className="font-display text-2xl font-black text-white">
            SMA <span className="text-[var(--color-amber-light)]">Builders</span>
          </h3>
          <p className="mt-3 text-sm text-white/60 leading-relaxed max-w-md">
            Your trusted real estate partner in Nellore, Andhra Pradesh. Specializing in DTCP-approved
            plots, layouts, flats, houses, and agricultural land.
          </p>
          <div className="mt-4 flex items-start gap-2 text-sm">
            <MapPin size={16} className="mt-0.5 text-[var(--color-amber-light)]" />
            <span>{OFFICE.addressEn}</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Clock size={16} className="text-[var(--color-amber-light)]" />
            <span>{OFFICE.hours}</span>
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-white font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-[var(--color-amber-light)]">Home</Link></li>
            <li><Link href="/properties" className="hover:text-[var(--color-amber-light)]">Properties</Link></li>
            <li><Link href="/about" className="hover:text-[var(--color-amber-light)]">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--color-amber-light)]">Contact</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Get in touch</h4>
          <ul className="space-y-3 text-sm">
            {AGENTS.map((a) => (
              <li key={a.name}>
                <p className="font-semibold text-white">{a.name}</p>
                <div className="flex flex-col gap-1 mt-1">
                  {a.phones.map((p) => (
                    <a key={p} href={telLink(p)} className="flex items-center gap-2 text-white/70 hover:text-[var(--color-amber-light)]">
                      <Phone size={12} /> {p}
                    </a>
                  ))}
                  <a href={waLink(a.whatsapp)} target="_blank" rel="noopener" className="flex items-center gap-2 text-[var(--color-wa)] hover:opacity-80">
                    <MessageCircle size={12} /> WhatsApp
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Disclaimer band */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-white/10">
        <div className="text-xs text-white/50 leading-relaxed">
          <strong className="text-white/70">Disclaimer:</strong> Property images, dimensions, and prices shown on this website are indicative and subject to change without notice. Please verify all details and documents independently before making any purchase decision. Photographs may not reflect the current state of the property.
        </div>
        <div className="text-xs text-white/50 leading-relaxed mt-2">
          <strong className="text-white/70">RERA Registration:</strong> [Project-specific RERA registration numbers will be provided on request before any sale agreement]
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} SMA Builders & Real Estates. All Rights Reserved.
          </p>
          <ul className="flex gap-5 text-xs text-white/60">
            <li><Link href="/privacy" className="hover:text-[var(--color-amber-light)]">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-[var(--color-amber-light)]">Terms & Conditions</Link></li>
            <li><Link href="/contact" className="hover:text-[var(--color-amber-light)]">Contact</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

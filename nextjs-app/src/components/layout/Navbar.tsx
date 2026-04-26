'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Menu, X, User, Phone, Shield } from 'lucide-react';
import { AGENTS } from '@/data/agents';
import { LanguageToggle } from './LanguageToggle';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export function Navbar() {
  const { user, signOut, openAuthModal } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 inset-x-0 z-50 bg-[#0F2342] backdrop-blur-md shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-black text-xl text-white">
              SMA <span className="text-[var(--color-amber-light)]">Builders</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm font-medium text-white/85 hover:text-[var(--color-amber-light)] transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {user?.isAdmin && (
              <li>
                <Link
                  href="/admin"
                  className="text-sm font-medium text-[var(--color-amber-light)] flex items-center gap-1"
                >
                  <Shield size={14} /> Admin
                </Link>
              </li>
            )}
          </ul>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20"
                >
                  <User size={14} />
                  {user.name.split(' ')[0]}
                </Link>
                <button
                  onClick={signOut}
                  className="text-xs text-white/60 hover:text-white"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20"
              >
                <User size={14} /> Sign In
              </button>
            )}
            <a
              href={`tel:+91${AGENTS[0].phones[0]}`}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--color-amber)] text-gray-900 text-sm font-bold hover:bg-[var(--color-amber-light)]"
            >
              <Phone size={14} /> Call Us
            </a>
          </div>

          {/* Mobile burger */}
          <button
            onClick={() => setMobileOpen((s) => !s)}
            className="md:hidden text-white"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-[var(--color-navy-dark)] border-t border-white/10">
            <ul className="flex flex-col p-4 gap-1">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-white/90 rounded-lg hover:bg-white/10"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {user?.isAdmin && (
                <li>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-[var(--color-amber-light)] rounded-lg hover:bg-white/10"
                  >
                    ⚙ Admin Panel
                  </Link>
                </li>
              )}
              <li className="px-4 py-2">
                <LanguageToggle />
              </li>
              <li className="pt-2 border-t border-white/10 mt-2">
                {user ? (
                  <button
                    onClick={() => { signOut(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 text-white/90 rounded-lg hover:bg-white/10"
                  >
                    👋 {user.name} (Sign out)
                  </button>
                ) : (
                  <button
                    onClick={() => { openAuthModal(); setMobileOpen(false); }}
                    className="w-full text-left px-4 py-3 text-white/90 rounded-lg hover:bg-white/10"
                  >
                    👤 Sign In / Register
                  </button>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>

      <div className="h-16" />
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Phone, Mail, Tag, Calendar, LogOut, Heart } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { subscribeFavorites } from '@/lib/favorites';
import { fetchProperties } from '@/lib/properties';
import { PropertyCard } from '@/components/property/PropertyCard';
import type { Property } from '@/lib/types';

export default function AccountPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeFavorites(user.uid, setFavoriteIds);
    fetchProperties().then(setAllProperties);
    return unsub;
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;
  }

  const favoriteProperties = allProperties.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] p-8 text-white">
            <div className="w-20 h-20 rounded-full bg-[var(--color-amber)] text-gray-900 flex items-center justify-center text-3xl font-black mb-4">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <h1 className="font-display text-3xl font-black">{user.name}</h1>
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

            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-gray-100">
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[var(--color-navy)] text-white font-bold hover:bg-[var(--color-navy-light)]"
                >
                  ⚙ Admin Dashboard
                </Link>
              )}
              <button
                onClick={signOut}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-red-200 text-red-700 font-bold hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Favorites */}
        <section className="mt-10">
          <div className="flex items-center gap-3 mb-5">
            <Heart size={22} className="text-red-500 fill-red-500" />
            <h2 className="font-display text-2xl font-black text-gray-900">My Favorite Properties</h2>
            <span className="ml-auto px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
              {favoriteProperties.length}
            </span>
          </div>

          {favoriteProperties.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
              <Heart size={48} className="mx-auto text-gray-200" />
              <p className="text-gray-500 mt-4">No favorite properties yet.</p>
              <p className="text-xs text-gray-400 mt-1">
                Click the ❤ icon on any property card to save it here.
              </p>
              <Link
                href="/properties"
                className="mt-5 inline-block px-5 py-2.5 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold hover:bg-[var(--color-navy-light)]"
              >
                Browse Properties
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProperties.map((p, i) => (
                <PropertyCard key={p.id} property={p} index={i} />
              ))}
            </div>
          )}
        </section>
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

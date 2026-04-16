'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { fetchProperties } from '@/lib/properties';
import { getInquiries, deleteInquiry, type Inquiry } from '@/lib/inquiries';
import {
  Users, Eye, Home, MessageCircle, Phone, Trash2, Star, Inbox, Mail, BarChart3
} from 'lucide-react';
import { waLink, telLink } from '@/lib/utils';
import { AnalyticsTab } from '@/components/admin/AnalyticsTab';
import type { AppUser, Property } from '@/lib/types';

type Tab = 'overview' | 'leads' | 'users' | 'analytics';

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<Record<string, AppUser>>({});
  const [props, setProps] = useState<Property[]>([]);
  const [inquiries, setInquiries] = useState<Record<string, Inquiry>>({});
  const [visitors, setVisitors] = useState<number>(0);
  const [visitorsRaw, setVisitorsRaw] = useState<Record<string, { time: string; date: string; page: string; ref: string; ua: string }>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    const [propList, uSnap, inqs, vSnap] = await Promise.all([
      fetchProperties(),
      get(ref(db, 'users')),
      getInquiries(),
      get(ref(db, 'visitors'))
    ]);
    setProps(propList);
    const rawVisitors = vSnap.exists() ? vSnap.val() : {};
    setVisitorsRaw(rawVisitors);
    setVisitors(Object.keys(rawVisitors).length);
    setUsers(uSnap.exists() ? (uSnap.val() as Record<string, AppUser>) : {});
    setInquiries(inqs);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const toggleAdmin = async (uid: string, makeAdmin: boolean) => {
    if (!confirm(makeAdmin ? 'Promote this user to ADMIN?' : 'Remove admin rights?')) return;
    try {
      await set(ref(db, `users/${uid}/isAdmin`), makeAdmin || null);
      toast.success(makeAdmin ? 'User promoted to admin' : 'Admin rights removed');
      await loadAll();
    } catch {
      toast.error('Could not update user. Check Firebase rules.');
    }
  };

  const deleteUserRow = async (uid: string) => {
    if (!confirm('Permanently delete this user from the database?')) return;
    try {
      await set(ref(db, `users/${uid}`), null);
      toast.success('User deleted');
      await loadAll();
    } catch {
      toast.error('Could not delete user.');
    }
  };

  const removeInquiry = async (id: string) => {
    if (!confirm('Delete this lead?')) return;
    try {
      await deleteInquiry(id);
      toast.success('Lead deleted');
      await loadAll();
    } catch {
      toast.error('Could not delete lead.');
    }
  };

  const userEntries = Object.entries(users).sort((a, b) =>
    (b[1].createdAt || '').localeCompare(a[1].createdAt || '')
  );

  const inquiryEntries = Object.entries(inquiries).sort((a, b) =>
    (b[1].createdAt || '').localeCompare(a[1].createdAt || '')
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-4xl font-black text-gray-900">Admin Dashboard</h1>
      <p className="text-gray-500 text-sm mt-2">Manage properties, leads, users, and view site activity.</p>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <StatCard icon={Eye} label="Visitors" value={visitors} color="bg-blue-500" />
        <StatCard icon={Inbox} label="New Leads" value={inquiryEntries.length} color="bg-rose-500" />
        <StatCard icon={Users} label="Registered" value={userEntries.length} color="bg-green-500" />
        <StatCard icon={Home} label="Properties" value={props.length} color="bg-amber-500" />
      </div>

      {/* Quick actions */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/admin/properties"
          className="px-5 py-2.5 rounded-lg bg-[var(--color-amber)] text-gray-900 text-sm font-bold hover:bg-[var(--color-amber-light)]"
        >
          ➕ Manage Properties
        </Link>
        <Link
          href="/properties"
          target="_blank"
          className="px-5 py-2.5 rounded-lg bg-[var(--color-navy)] text-white text-sm font-bold hover:bg-[var(--color-navy-light)]"
        >
          🏠 View Live Site
        </Link>
      </div>

      {/* Tabs */}
      <div className="mt-10 border-b border-gray-200">
        <nav className="flex gap-1 -mb-px">
          <TabBtn active={tab === 'overview'} onClick={() => setTab('overview')}>Overview</TabBtn>
          <TabBtn active={tab === 'leads'} onClick={() => setTab('leads')}>
            📥 Leads {inquiryEntries.length > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs">{inquiryEntries.length}</span>}
          </TabBtn>
          <TabBtn active={tab === 'users'} onClick={() => setTab('users')}>👥 Users</TabBtn>
          <TabBtn active={tab === 'analytics'} onClick={() => setTab('analytics')}>📊 Analytics</TabBtn>
        </nav>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-400">Loading…</div>
        ) : tab === 'overview' ? (
          <OverviewTab inquiries={inquiryEntries.slice(0, 5)} users={userEntries.slice(0, 5)} />
        ) : tab === 'leads' ? (
          <LeadsTab inquiries={inquiryEntries} onDelete={removeInquiry} />
        ) : tab === 'analytics' ? (
          <AnalyticsTab visitors={visitorsRaw} inquiries={inquiryEntries} users={userEntries} />
        ) : (
          <UsersTab users={userEntries} onPromote={toggleAdmin} onDelete={deleteUserRow} />
        )}
      </div>
    </div>
  );
}

/* ─── Stat tile ─────────────────────────── */
function StatCard({ icon: Icon, label, value, color }: { icon: typeof Eye; label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-3">
      <div className={`w-11 h-11 rounded-xl ${color} text-white flex items-center justify-center`}>
        <Icon size={20} />
      </div>
      <div>
        <div className="text-2xl font-black text-gray-900">{value}</div>
        <div className="text-xs uppercase tracking-wide text-gray-500">{label}</div>
      </div>
    </div>
  );
}

/* ─── Tabs ─────────────────────────── */
function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-sm font-bold border-b-[3px] transition-colors ${
        active ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400 hover:text-gray-600'
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Overview ─────────────────────────── */
function OverviewTab({ inquiries, users }: { inquiries: [string, Inquiry][]; users: [string, AppUser][] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">📥 Latest Leads</h3>
        {inquiries.length === 0 ? (
          <p className="text-sm text-gray-400">No leads yet.</p>
        ) : (
          <ul className="space-y-3">
            {inquiries.map(([id, q]) => (
              <li key={id} className="text-sm border-l-2 border-rose-300 pl-3">
                <strong>{q.name}</strong> · {q.phone}
                {q.propertyName && <span className="text-gray-500"> · {q.propertyName}</span>}
                <div className="text-xs text-gray-400 mt-0.5">{q.createdAtIN}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">👥 Recent Registrations</h3>
        {users.length === 0 ? (
          <p className="text-sm text-gray-400">No registered users yet.</p>
        ) : (
          <ul className="space-y-3">
            {users.map(([id, u]) => (
              <li key={id} className="text-sm border-l-2 border-green-300 pl-3">
                <strong>{u.name}</strong>
                {u.isAdmin && <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">⭐ ADMIN</span>}
                <div className="text-xs text-gray-500">📞 {u.phone}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ─── Leads tab ─────────────────────────── */
function LeadsTab({ inquiries, onDelete }: { inquiries: [string, Inquiry][]; onDelete: (id: string) => void }) {
  if (inquiries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <Inbox size={48} className="mx-auto text-gray-300" />
        <p className="text-gray-500 mt-4">No leads yet.</p>
        <p className="text-xs text-gray-400 mt-1">When visitors fill out the contact form, they appear here.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
      {inquiries.map(([id, q]) => {
        const phone = q.phone.replace(/[^0-9]/g, '');
        return (
          <div key={id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-gray-900">{q.name}</strong>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{q.source.replace('_', ' ')}</span>
              </div>
              <div className="text-sm text-gray-600 mt-1">📞 {q.phone} {q.email && `· ✉ ${q.email}`}</div>
              {q.propertyName && <div className="text-sm text-[var(--color-navy)] mt-1">🏠 {q.propertyName}</div>}
              {q.message && <div className="text-sm text-gray-500 mt-1 italic">&ldquo;{q.message}&rdquo;</div>}
              <div className="text-xs text-gray-400 mt-1">{q.createdAtIN}</div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <a href={waLink(phone, `Hi ${q.name}, this is SMA Builders.`)} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-md bg-[var(--color-wa)] text-white text-xs font-bold inline-flex items-center gap-1">
                <MessageCircle size={12} /> WA
              </a>
              <a href={telLink(phone)} className="px-3 py-1.5 rounded-md bg-[var(--color-navy)] text-white text-xs font-bold inline-flex items-center gap-1">
                <Phone size={12} /> Call
              </a>
              {q.email && (
                <a href={`mailto:${q.email}`} className="px-3 py-1.5 rounded-md bg-amber-500 text-gray-900 text-xs font-bold inline-flex items-center gap-1">
                  <Mail size={12} /> Email
                </a>
              )}
              <button onClick={() => onDelete(id)} className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-xs font-bold inline-flex items-center gap-1">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Users tab ─────────────────────────── */
function UsersTab({
  users,
  onPromote,
  onDelete
}: {
  users: [string, AppUser][];
  onPromote: (uid: string, makeAdmin: boolean) => void;
  onDelete: (uid: string) => void;
}) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
        <Users size={48} className="mx-auto text-gray-300" />
        <p className="text-gray-500 mt-4">No registered users yet.</p>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100 overflow-hidden">
      {users.map(([uid, u]) => {
        const phone = (u.phone || '').replace(/[^0-9]/g, '');
        return (
          <div key={uid} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="font-bold text-gray-900 flex items-center gap-2">
                {u.name}
                {u.isAdmin && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">⭐ ADMIN</span>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-0.5">
                📞 {u.phone} {u.email && `· ✉ ${u.email}`} {u.interest && `· 🏠 ${u.interest}`}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                Joined: {new Date(u.createdAt).toLocaleString('en-IN')}
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {phone && (
                <a href={waLink(phone, `Hi ${u.name}, this is SMA Builders.`)} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-md bg-[var(--color-wa)] text-white text-xs font-bold inline-flex items-center gap-1">
                  <MessageCircle size={12} /> WA
                </a>
              )}
              {phone && (
                <a href={telLink(phone)} className="px-3 py-1.5 rounded-md bg-[var(--color-navy)] text-white text-xs font-bold inline-flex items-center gap-1">
                  <Phone size={12} /> Call
                </a>
              )}
              <button
                onClick={() => onPromote(uid, !u.isAdmin)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-1 ${
                  u.isAdmin ? 'bg-amber-100 text-amber-800' : 'bg-amber-500 text-gray-900'
                }`}
              >
                <Star size={12} /> {u.isAdmin ? 'Demote' : 'Promote'}
              </button>
              <button onClick={() => onDelete(uid)} className="px-3 py-1.5 rounded-md bg-red-100 text-red-700 text-xs font-bold inline-flex items-center gap-1">
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

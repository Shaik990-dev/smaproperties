'use client';

import { useMemo } from 'react';
import { BarChart3, TrendingUp, Globe, Calendar, Users, Inbox } from 'lucide-react';
import type { AppUser } from '@/lib/types';
import type { Inquiry } from '@/lib/inquiries';

interface Visit {
  time: string;
  date: string;
  page: string;
  ref: string;
  ua: string;
}

interface Props {
  visitors: Record<string, Visit>;
  inquiries: [string, Inquiry][];
  users: [string, AppUser][];
}

export function AnalyticsTab({ visitors, inquiries, users }: Props) {
  const visitList = useMemo(() => Object.values(visitors), [visitors]);

  // Visits per day (last 30 days)
  const dailyVisits = useMemo(() => {
    const counts: Record<string, number> = {};
    const today = new Date();
    // Init last 14 days
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-IN');
      counts[key] = 0;
    }
    for (const v of visitList) {
      if (v.date && counts[v.date] !== undefined) {
        counts[v.date]++;
      }
    }
    return Object.entries(counts);
  }, [visitList]);

  // Top pages
  const topPages = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of visitList) {
      const page = v.page || '/';
      counts[page] = (counts[page] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [visitList]);

  // Referrer sources
  const topReferrers = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const v of visitList) {
      let source = 'Direct';
      if (v.ref && v.ref !== 'direct') {
        try {
          source = new URL(v.ref).hostname;
        } catch {
          source = v.ref.substring(0, 30);
        }
      }
      counts[source] = (counts[source] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [visitList]);

  // Leads by source
  const leadsBySource = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const [, inq] of inquiries) {
      const src = (inq.source || 'unknown').replace('_', ' ');
      counts[src] = (counts[src] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [inquiries]);

  // Leads over time (last 14 days)
  const dailyLeads = useMemo(() => {
    const counts: Record<string, number> = {};
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      counts[key] = 0;
    }
    for (const [, inq] of inquiries) {
      const day = inq.createdAt?.slice(0, 10);
      if (day && counts[day] !== undefined) {
        counts[day]++;
      }
    }
    return Object.entries(counts);
  }, [inquiries]);

  // Users over time
  const registrationsThisMonth = useMemo(() => {
    const thisMonth = new Date().toISOString().slice(0, 7);
    return users.filter(([, u]) => u.createdAt?.startsWith(thisMonth)).length;
  }, [users]);

  const maxDailyVisit = Math.max(...dailyVisits.map(([, c]) => c), 1);
  const maxDailyLead = Math.max(...dailyLeads.map(([, c]) => c), 1);

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MiniCard icon={Globe} label="Total Visits" value={visitList.length} color="text-blue-600" bg="bg-blue-50" />
        <MiniCard icon={Inbox} label="Total Leads" value={inquiries.length} color="text-rose-600" bg="bg-rose-50" />
        <MiniCard icon={Users} label="Registrations This Month" value={registrationsThisMonth} color="text-green-600" bg="bg-green-50" />
        <MiniCard
          icon={TrendingUp}
          label="Conversion Rate"
          value={visitList.length > 0 ? `${((inquiries.length / visitList.length) * 100).toFixed(1)}%` : '0%'}
          color="text-amber-600"
          bg="bg-amber-50"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily visits chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-blue-500" />
            <h3 className="font-bold text-gray-900 text-sm">Daily Visits (Last 14 Days)</h3>
          </div>
          <div className="flex items-end gap-1 h-40">
            {dailyVisits.map(([date, count]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500 font-bold">{count || ''}</span>
                <div
                  className="w-full bg-blue-500 rounded-t-sm min-h-[2px] transition-all"
                  style={{ height: `${(count / maxDailyVisit) * 120}px` }}
                  title={`${date}: ${count} visits`}
                />
                <span className="text-[8px] text-gray-400 -rotate-45 origin-top-left whitespace-nowrap">
                  {date.split('/').slice(0, 2).join('/')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Daily leads chart */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Inbox size={18} className="text-rose-500" />
            <h3 className="font-bold text-gray-900 text-sm">Daily Leads (Last 14 Days)</h3>
          </div>
          <div className="flex items-end gap-1 h-40">
            {dailyLeads.map(([date, count]) => (
              <div key={date} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-gray-500 font-bold">{count || ''}</span>
                <div
                  className="w-full bg-rose-500 rounded-t-sm min-h-[2px] transition-all"
                  style={{ height: `${(count / maxDailyLead) * 120}px` }}
                  title={`${date}: ${count} leads`}
                />
                <span className="text-[8px] text-gray-400 -rotate-45 origin-top-left whitespace-nowrap">
                  {date.slice(5)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top pages */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Globe size={16} className="text-blue-500" /> Top Pages
          </h3>
          <div className="space-y-2">
            {topPages.map(([page, count]) => (
              <div key={page} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 font-mono text-xs truncate flex-1 mr-2">{page}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 rounded-full"
                      style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic sources */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-green-500" /> Traffic Sources
          </h3>
          <div className="space-y-2">
            {topReferrers.map(([source, count]) => (
              <div key={source} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 text-xs truncate flex-1 mr-2">{source}</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-400 rounded-full"
                      style={{ width: `${(count / (topReferrers[0]?.[1] || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leads by source */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
            <Inbox size={16} className="text-rose-500" /> Leads by Source
          </h3>
          {leadsBySource.length === 0 ? (
            <p className="text-xs text-gray-400">No leads yet</p>
          ) : (
            <div className="space-y-2">
              {leadsBySource.map(([source, count]) => (
                <div key={source} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 text-xs capitalize flex-1 mr-2">{source}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-400 rounded-full"
                        style={{ width: `${(count / (leadsBySource[0]?.[1] || 1)) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  icon: Icon,
  label,
  value,
  color,
  bg
}: {
  icon: typeof Globe;
  label: string;
  value: number | string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`${bg} rounded-2xl p-5 border border-gray-100`}>
      <Icon size={20} className={color} />
      <div className="text-2xl font-black text-gray-900 mt-2">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

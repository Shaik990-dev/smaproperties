'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { registerUser, loginUser } from '@/lib/auth';
import { notifyOwner } from '@/lib/emailjs';
import { useAuth } from './AuthProvider';

interface Props {
  open: boolean;
  onClose: () => void;
}

type Tab = 'login' | 'register' | 'forgot';

// Rate-limit config
const RL_KEY = 'sma-pwd-reset';
const MAX_ATTEMPTS = 3;
const COOLDOWN_S = 60;         // seconds between sends
const LOCKOUT_MS = 12 * 60 * 60 * 1000; // 12 hours

interface RLData {
  attempts: number;
  lastSentAt: number;   // ms timestamp
  lockedUntil: number;  // ms timestamp, 0 = not locked
}

function loadRL(): RLData {
  try {
    const raw = localStorage.getItem(RL_KEY);
    if (raw) return JSON.parse(raw) as RLData;
  } catch {}
  return { attempts: 0, lastSentAt: 0, lockedUntil: 0 };
}

function saveRL(d: RLData) {
  localStorage.setItem(RL_KEY, JSON.stringify(d));
}

export function AuthModal({ open, onClose }: Props) {
  const { refresh } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'err' | 'ok'; text: string } | null>(null);

  // form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interest, setInterest] = useState('');

  // rate-limit UI state
  const [cooldown, setCooldown] = useState(0);       // seconds left before can resend
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedSecs, setLockedSecs] = useState(0);   // seconds until lockout lifts
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load rate-limit state whenever forgot tab opens
  useEffect(() => {
    if (tab !== 'forgot') return;
    syncRL();
  }, [tab]);

  // Tick every second while on forgot tab
  useEffect(() => {
    if (tab !== 'forgot') return;
    timerRef.current = setInterval(() => syncRL(), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [tab]);

  function syncRL() {
    const rl = loadRL();
    const now = Date.now();

    if (rl.lockedUntil > now) {
      setLockedSecs(Math.ceil((rl.lockedUntil - now) / 1000));
      setCooldown(0);
      setAttemptsLeft(0);
      return;
    }

    setLockedSecs(0);
    setAttemptsLeft(MAX_ATTEMPTS - rl.attempts);
    const secsSinceLast = (now - rl.lastSentAt) / 1000;
    const remaining = Math.max(0, Math.ceil(COOLDOWN_S - secsSinceLast));
    setCooldown(remaining);
  }

  if (!open) return null;

  const reset = () => {
    setName(''); setPhone(''); setEmail(''); setPassword(''); setInterest('');
    setMsg(null);
  };

  const handleClose = () => {
    reset();
    setTab('login');
    if (timerRef.current) clearInterval(timerRef.current);
    onClose();
  };

  const switchTab = (t: Tab) => { setMsg(null); setTab(t); };

  /* ── Login ── */
  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const u = await loginUser(email, password);
      await refresh();
      toast.success(`Welcome back, ${u.name}!`);
      setMsg({ kind: 'ok', text: '✅ Signed in successfully' });
      setTimeout(handleClose, 700);
    } catch (err) {
      const cleaned = (err instanceof Error ? err.message : 'Sign in failed').replace('Firebase: ', '');
      setMsg({ kind: 'err', text: cleaned });
      toast.error(cleaned);
    } finally { setLoading(false); }
  };

  /* ── Register ── */
  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      setMsg({ kind: 'err', text: 'Please fill all required fields' }); return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-]/g, ''))) {
      setMsg({ kind: 'err', text: 'Enter a valid 10-digit Indian mobile number' }); return;
    }
    if (password.length < 6) {
      setMsg({ kind: 'err', text: 'Password must be at least 6 characters' }); return;
    }
    setLoading(true); setMsg(null);
    try {
      await registerUser({ name, phone, email, password, interest });
      await refresh();
      notifyOwner({ type: 'registration', name, phone, email, interest }).catch(() => {});
      toast.success(`Welcome, ${name}! Your account has been created.`);
      setMsg({ kind: 'ok', text: '✅ Account created! You are now signed in.' });
      setTimeout(handleClose, 900);
    } catch (err) {
      const cleaned = (err instanceof Error ? err.message : 'Registration failed').replace('Firebase: ', '');
      setMsg({ kind: 'err', text: cleaned });
      toast.error(cleaned);
    } finally { setLoading(false); }
  };

  /* ── Forgot password ── */
  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setMsg({ kind: 'err', text: 'Please enter your email address' }); return; }

    // Guard: lockout
    if (lockedSecs > 0) {
      const hrs = Math.ceil(lockedSecs / 3600);
      setMsg({ kind: 'err', text: `Too many attempts. Try again in ${hrs} hour${hrs > 1 ? 's' : ''}.` });
      return;
    }
    // Guard: cooldown
    if (cooldown > 0) {
      setMsg({ kind: 'err', text: `Please wait ${cooldown}s before requesting another link.` });
      return;
    }

    setLoading(true); setMsg(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        setMsg({ kind: 'err', text: data.error ?? 'Failed to send reset email. Please try again.' });
        toast.error(data.error ?? 'Failed to send reset email.');
        return;
      }

      // Update rate-limit store
      const rl = loadRL();
      const newAttempts = rl.attempts + 1;
      saveRL({
        attempts: newAttempts,
        lastSentAt: Date.now(),
        lockedUntil: newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0,
      });
      syncRL();

      const left = MAX_ATTEMPTS - newAttempts;
      const note = left > 0 ? ` (${left} attempt${left > 1 ? 's' : ''} left)` : '';
      setMsg({
        kind: 'ok',
        text: `✅ Reset link sent to ${email}. Check your inbox.${note}`,
      });
      toast.success('Password reset email sent!');
    } catch {
      const text = 'Something went wrong. Please try again.';
      setMsg({ kind: 'err', text });
      toast.error(text);
    } finally { setLoading(false); }
  };

  /* ── Helpers ── */
  const fmtLock = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const canSend = cooldown === 0 && lockedSecs === 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] p-6 flex justify-between items-center">
          <h3 className="font-display text-2xl font-black text-white">
            {tab === 'forgot' ? 'Reset Password' : 'Welcome to SMA'}
          </h3>
          <button onClick={handleClose} className="text-white hover:opacity-70">
            <X size={22} />
          </button>
        </div>

        {/* Tabs — hidden on forgot view */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => switchTab('login')}
              className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${
                tab === 'login' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab('register')}
              className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${
                tab === 'register' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'
              }`}
            >
              Register
            </button>
          </div>
        )}

        <div className="p-6">
          {/* ── Login form ── */}
          {tab === 'login' && (
            <form onSubmit={submitLogin} className="space-y-3">
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputCls} required />
              </Field>
              <Field label="Password">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputCls} required />
              </Field>
              <div className="text-right">
                <button type="button" onClick={() => switchTab('forgot')}
                  className="text-xs text-[var(--color-navy)] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : '🔐 Sign In'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                No account? Click <strong>Register</strong> above.
                Browsing the site does not require an account.
              </p>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === 'register' && (
            <form onSubmit={submitRegister} className="space-y-3">
              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name" className={inputCls} required />
              </Field>
              <Field label="Phone *">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210" maxLength={15} className={inputCls} required />
              </Field>
              <Field label="Email *">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputCls} required />
              </Field>
              <Field label="Password * (min 6 chars)">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputCls} required />
              </Field>
              <Field label="Interested In">
                <input type="text" value={interest} onChange={(e) => setInterest(e.target.value)}
                  placeholder="Plots / Flats / Houses / Land" className={inputCls} />
              </Field>
              <Button type="submit" disabled={loading} variant="amber" className="w-full">
                {loading ? 'Creating…' : '✨ Create Account'}
              </Button>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By registering you allow SMA Builders to contact you about properties.
              </p>
            </form>
          )}

          {/* ── Forgot password form ── */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Enter your registered email and we&apos;ll send a password reset link.
                <br />
                <span className="text-xs text-gray-400">
                  Check your spam/junk folder if you don&apos;t see it within 2 minutes.
                </span>
              </p>

              {/* Lockout banner */}
              {lockedSecs > 0 && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center">
                  🔒 Too many attempts. Retry in <strong>{fmtLock(lockedSecs)}</strong>
                </div>
              )}

              {/* Attempts indicator */}
              {lockedSecs === 0 && (
                <div className="flex gap-1.5 items-center">
                  {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${
                        i < attemptsLeft ? 'bg-[var(--color-amber)]' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-1 whitespace-nowrap">
                    {attemptsLeft}/{MAX_ATTEMPTS} attempts
                  </span>
                </div>
              )}

              <form onSubmit={submitForgot} className="space-y-3">
                <Field label="Registered Email">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className={inputCls} required autoFocus
                    disabled={lockedSecs > 0} />
                </Field>
                <Button
                  type="submit"
                  disabled={loading || !canSend}
                  className="w-full"
                >
                  {loading
                    ? 'Sending…'
                    : cooldown > 0
                    ? `Resend in ${cooldown}s`
                    : lockedSecs > 0
                    ? `Locked — ${fmtLock(lockedSecs)}`
                    : '📧 Send Reset Link'}
                </Button>
              </form>

              <button type="button" onClick={() => switchTab('login')}
                className="w-full text-sm text-[var(--color-navy)] hover:underline font-medium">
                ← Back to Sign In
              </button>
            </div>
          )}

          {msg && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${
              msg.kind === 'err' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
            }`}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)] disabled:opacity-50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

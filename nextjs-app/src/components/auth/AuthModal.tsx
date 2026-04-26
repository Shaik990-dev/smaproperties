'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { X } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
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
const COOLDOWN_S = 60;
const LOCKOUT_MS = 12 * 60 * 60 * 1000;

interface RLData {
  attempts: number;
  lastSentAt: number;
  lockedUntil: number;
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

// Map Firebase error codes to plain English
function friendlyAuthError(err: unknown): string {
  const code = (err as { code?: string }).code ?? '';
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return 'Incorrect email or password. Please try again.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many failed attempts. Please wait a few minutes and try again.';
  }
  if (code === 'auth/invalid-email') return 'Please enter a valid email address.';
  if (code === 'auth/user-disabled') return 'This account has been disabled. Please contact us.';
  if (code === 'auth/email-already-in-use') return 'An account with this email already exists. Please sign in.';
  if (code === 'auth/weak-password') return 'Password is too weak. Please use at least 6 characters.';
  if (code === 'auth/network-request-failed') return 'Network error. Please check your connection and try again.';
  const msg = err instanceof Error ? err.message : '';
  return msg.replace('Firebase: ', '').replace(/\s*\(auth\/[^)]+\)\.?/, '').trim() || 'Something went wrong. Please try again.';
}

export function AuthModal({ open, onClose }: Props) {
  const { refresh } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'err' | 'ok'; text: string } | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interest, setInterest] = useState('');

  const [cooldown, setCooldown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [lockedSecs, setLockedSecs] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (tab !== 'forgot') return;
    syncRL();
  }, [tab]);

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
      setCooldown(0); setAttemptsLeft(0); return;
    }
    setLockedSecs(0);
    setAttemptsLeft(MAX_ATTEMPTS - rl.attempts);
    const remaining = Math.max(0, Math.ceil(COOLDOWN_S - (now - rl.lastSentAt) / 1000));
    setCooldown(remaining);
  }

  if (!open) return null;

  const reset = () => { setName(''); setPhone(''); setEmail(''); setPassword(''); setInterest(''); setMsg(null); };
  const handleClose = () => { reset(); setTab('login'); if (timerRef.current) clearInterval(timerRef.current); onClose(); };
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
      const text = friendlyAuthError(err);
      setMsg({ kind: 'err', text });
      toast.error(text);
    } finally { setLoading(false); }
  };

  /* ── Register ── */
  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) { setMsg({ kind: 'err', text: 'Please fill all required fields' }); return; }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-]/g, ''))) { setMsg({ kind: 'err', text: 'Enter a valid 10-digit Indian mobile number' }); return; }
    if (password.length < 6) { setMsg({ kind: 'err', text: 'Password must be at least 6 characters' }); return; }
    setLoading(true); setMsg(null);
    try {
      await registerUser({ name, phone, email, password, interest });
      await refresh();
      notifyOwner({ type: 'registration', name, phone, email, interest }).catch(() => {});
      toast.success(`Welcome, ${name}!`);
      setMsg({ kind: 'ok', text: '✅ Account created! You are now signed in.' });
      setTimeout(handleClose, 900);
    } catch (err) {
      const text = friendlyAuthError(err);
      setMsg({ kind: 'err', text });
      toast.error(text);
    } finally { setLoading(false); }
  };

  /* ── Forgot password ── */
  const submitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setMsg({ kind: 'err', text: 'Please enter your email address' }); return; }
    if (lockedSecs > 0) {
      const hrs = Math.ceil(lockedSecs / 3600);
      setMsg({ kind: 'err', text: `Too many attempts. Try again in ${hrs} hour${hrs > 1 ? 's' : ''}.` }); return;
    }
    if (cooldown > 0) { setMsg({ kind: 'err', text: `Please wait ${cooldown}s before requesting another link.` }); return; }

    setLoading(true); setMsg(null);
    try {
      // Try branded Resend email first
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };

      if (!res.ok) {
        if (res.status === 404 || res.status === 400) {
          // User error — unregistered email or invalid format
          setMsg({ kind: 'err', text: data.error ?? 'Something went wrong.' });
          toast.error(data.error ?? 'Something went wrong.');
          return;
        }
        // Resend service error — fall back to Firebase email
        await sendPasswordResetEmail(auth, email);
      }

      // Success — update rate limit
      const rl = loadRL();
      const newAttempts = rl.attempts + 1;
      saveRL({ attempts: newAttempts, lastSentAt: Date.now(), lockedUntil: newAttempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0 });
      syncRL();

      setMsg({ kind: 'ok', text: `✅ Reset link sent to ${email}. Check your inbox.` });
      toast.success('Password reset email sent!');
    } catch (err) {
      const code = (err as { code?: string }).code;
      const text = code === 'auth/user-not-found'
        ? 'No account found with this email. Please register first.'
        : 'Failed to send reset email. Please try again.';
      setMsg({ kind: 'err', text });
      toast.error(text);
    } finally { setLoading(false); }
  };

  const fmtLock = (secs: number) => {
    const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const canSend = cooldown === 0 && lockedSecs === 0;
  const attemptsUsed = MAX_ATTEMPTS - attemptsLeft;

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
          <button onClick={handleClose} className="text-white hover:opacity-70"><X size={22} /></button>
        </div>

        {/* Tabs */}
        {tab !== 'forgot' && (
          <div className="flex border-b border-gray-200">
            <button onClick={() => switchTab('login')} className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${tab === 'login' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'}`}>
              Sign In
            </button>
            <button onClick={() => switchTab('register')} className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${tab === 'register' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'}`}>
              Register
            </button>
          </div>
        )}

        <div className="p-6">
          {/* ── Login ── */}
          {tab === 'login' && (
            <form onSubmit={submitLogin} className="space-y-3">
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} required />
              </Field>
              <Field label="Password">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
              </Field>
              <div className="text-right">
                <button type="button" onClick={() => switchTab('forgot')} className="text-xs text-[var(--color-navy)] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : '🔐 Sign In'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                No account? Click <strong>Register</strong> above.
              </p>
            </form>
          )}

          {/* ── Register ── */}
          {tab === 'register' && (
            <form onSubmit={submitRegister} className="space-y-3">
              <Field label="Full Name *">
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className={inputCls} required />
              </Field>
              <Field label="Phone *">
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="9876543210" maxLength={15} className={inputCls} required />
              </Field>
              <Field label="Email *">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} required />
              </Field>
              <Field label="Password * (min 6 chars)">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} required />
              </Field>
              <Field label="Interested In">
                <input type="text" value={interest} onChange={(e) => setInterest(e.target.value)} placeholder="Plots / Flats / Houses / Land" className={inputCls} />
              </Field>
              <Button type="submit" disabled={loading} variant="amber" className="w-full">
                {loading ? 'Creating…' : '✨ Create Account'}
              </Button>
              <p className="text-xs text-gray-500 text-center leading-relaxed">
                By registering you allow SMA Builders to contact you.
              </p>
            </form>
          )}

          {/* ── Forgot password ── */}
          {tab === 'forgot' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                Enter your registered email address and we&apos;ll send you a link to reset your password.
              </p>

              {/* Lockout banner */}
              {lockedSecs > 0 && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 text-center font-medium">
                  🔒 Too many attempts. Try again in <strong>{fmtLock(lockedSecs)}</strong>
                </div>
              )}

              {/* Attempts used indicator — only show after first attempt */}
              {attemptsUsed > 0 && lockedSecs === 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {Array.from({ length: MAX_ATTEMPTS }).map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i < attemptsLeft ? 'bg-[var(--color-amber)]' : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{attemptsLeft} attempt{attemptsLeft !== 1 ? 's' : ''} left</span>
                </div>
              )}

              <form onSubmit={submitForgot} className="space-y-3">
                <Field label="Email Address">
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" className={inputCls}
                    required autoFocus disabled={lockedSecs > 0}
                  />
                </Field>
                <Button type="submit" disabled={loading || !canSend} className="w-full">
                  {loading ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : lockedSecs > 0 ? `Locked — ${fmtLock(lockedSecs)}` : '📧 Send Reset Link'}
                </Button>
              </form>

              <button type="button" onClick={() => switchTab('login')} className="w-full text-sm text-[var(--color-navy)] hover:underline font-medium">
                ← Back to Sign In
              </button>
            </div>
          )}

          {msg && (
            <div className={`mt-4 p-3 rounded-lg text-sm text-center ${msg.kind === 'err' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls = 'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)] disabled:opacity-50';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

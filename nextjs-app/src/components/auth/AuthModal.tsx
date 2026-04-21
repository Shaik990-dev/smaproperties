'use client';

import { useState } from 'react';
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

type Tab = 'login' | 'register';

export function AuthModal({ open, onClose }: Props) {
  const { refresh } = useAuth();
  const [tab, setTab] = useState<Tab>('login');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'err' | 'ok'; text: string } | null>(null);

  // form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interest, setInterest] = useState('');

  if (!open) return null;

  const reset = () => {
    setName(''); setPhone(''); setEmail(''); setPassword(''); setInterest('');
    setMsg(null);
  };

  const handleClose = () => { reset(); onClose(); };

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const u = await loginUser(email, password);
      await refresh();
      toast.success(`Welcome back, ${u.name}!`);
      setMsg({ kind: 'ok', text: '✅ Signed in successfully' });
      setTimeout(handleClose, 700);
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Sign in failed';
      const cleaned = m.replace('Firebase: ', '');
      setMsg({ kind: 'err', text: cleaned });
      toast.error(cleaned);
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !password) {
      setMsg({ kind: 'err', text: 'Please fill all required fields' });
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-]/g, ''))) {
      setMsg({ kind: 'err', text: 'Enter a valid 10-digit Indian mobile number' });
      return;
    }
    if (password.length < 6) {
      setMsg({ kind: 'err', text: 'Password must be at least 6 characters' });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      await registerUser({ name, phone, email, password, interest });
      await refresh();
      // Notify owner by email (best-effort, non-blocking)
      notifyOwner({ type: 'registration', name, phone, email, interest }).catch(() => {});
      toast.success(`Welcome, ${name}! Your account has been created.`);
      setMsg({ kind: 'ok', text: '✅ Account created! You are now signed in.' });
      setTimeout(handleClose, 900);
    } catch (err) {
      const m = err instanceof Error ? err.message : 'Registration failed';
      const cleaned = m.replace('Firebase: ', '');
      setMsg({ kind: 'err', text: cleaned });
      toast.error(cleaned);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)] p-6 flex justify-between items-center">
          <h3 className="font-display text-2xl font-black text-white">
            Welcome to SMA
          </h3>
          <button onClick={handleClose} className="text-white hover:opacity-70">
            <X size={22} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => { setTab('login'); setMsg(null); }}
            className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${
              tab === 'login' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setTab('register'); setMsg(null); }}
            className={`flex-1 py-3 font-bold text-sm border-b-[3px] ${
              tab === 'register' ? 'border-[var(--color-amber)] text-[var(--color-navy)]' : 'border-transparent text-gray-400'
            }`}
          >
            Register
          </button>
        </div>

        <div className="p-6">
          {tab === 'login' ? (
            <form onSubmit={submitLogin} className="space-y-3">
              <Field label="Email">
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inputCls} required />
              </Field>
              <Field label="Password">
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputCls} required />
              </Field>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : '🔐 Sign In'}
              </Button>
              <p className="text-xs text-gray-500 text-center">
                No account? Click <strong>Register</strong> above.
                Browsing the site does not require an account.
              </p>
            </form>
          ) : (
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
  'w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--color-navy)]';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</span>
      {children}
    </label>
  );
}

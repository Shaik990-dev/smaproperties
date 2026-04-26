'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, signOutUser } from '@/lib/auth';
import { AuthModal } from './AuthModal';
import type { AppUser } from '@/lib/types';

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
  openAuthModal: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  signOut: async () => {},
  refresh: async () => {},
  openAuthModal: () => {}
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFbUser(u);
      if (u) {
        const profile = await getUserProfile(u);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const refresh = async () => {
    if (fbUser) {
      const profile = await getUserProfile(fbUser);
      setUser(profile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: async () => {
          await signOutUser();
          setUser(null);
        },
        refresh,
        openAuthModal: () => setAuthOpen(true)
      }}
    >
      {children}
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

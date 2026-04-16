'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Property } from '@/lib/types';

interface CompareContextValue {
  compareList: Property[];
  addToCompare: (p: Property) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
}

const CompareContext = createContext<CompareContextValue>({
  compareList: [],
  addToCompare: () => {},
  removeFromCompare: () => {},
  clearCompare: () => {},
  isInCompare: () => false,
});

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Property[]>([]);

  const addToCompare = (p: Property) => {
    setCompareList((prev) => {
      if (prev.length >= 3) return prev;
      if (prev.find((x) => x.id === p.id)) return prev;
      return [...prev, p];
    });
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((x) => x.id !== id));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (id: string) => compareList.some((x) => x.id === id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}

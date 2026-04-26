'use client';

import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { addFavorite, removeFavorite, subscribeFavorites } from '@/lib/favorites';

interface Props {
  propertyId: string;
  size?: 'sm' | 'lg';
}

export function FavoriteButton({ propertyId, size = 'sm' }: Props) {
  const { user, openAuthModal } = useAuth();
  const [favorited, setFavorited] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) { setFavorited(false); return; }
    const unsub = subscribeFavorites(user.uid, (ids) => {
      setFavorited(ids.includes(propertyId));
    });
    return unsub;
  }, [user, propertyId]);

  const toggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      openAuthModal();
      return;
    }
    setBusy(true);
    try {
      if (favorited) {
        await removeFavorite(user.uid, propertyId);
        toast.success('Removed from saved');
      } else {
        await addFavorite(user.uid, propertyId);
        toast.success('Property saved!');
      }
    } catch {
      toast.error('Could not update saved properties.');
    } finally {
      setBusy(false);
    }
  };

  const cls = size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';

  return (
    <button
      onClick={toggle}
      disabled={busy}
      aria-label={favorited ? 'Remove from saved' : 'Save property'}
      className={`${cls} flex items-center justify-center rounded-full bg-white/95 backdrop-blur shadow-md hover:scale-110 transition-transform disabled:opacity-50`}
    >
      <Heart
        size={size === 'lg' ? 22 : 16}
        className={favorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}
      />
    </button>
  );
}

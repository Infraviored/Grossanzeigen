import { useEffect, useState } from 'react';

export type RecentItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  locationText?: string | null;
  savedAt: string;
};

export function useRecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('recently-viewed');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const add = (item: Omit<RecentItem, 'savedAt'>) => {
    setItems((prev) => {
      const filtered = prev.filter((x) => x.id !== item.id);
      const next = [{ ...item, savedAt: new Date().toISOString() }, ...filtered].slice(0, 12);
      try { localStorage.setItem('recently-viewed', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  return { items, add } as const;
}



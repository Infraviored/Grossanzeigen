import { useEffect, useState } from 'react';

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('favorites');
      if (raw) setIds(JSON.parse(raw));
    } catch {}
  }, []);

  const toggle = (id: string) => {
    setIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try { localStorage.setItem('favorites', JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const isFavorite = (id: string) => ids.includes(id);

  return { ids, toggle, isFavorite } as const;
}



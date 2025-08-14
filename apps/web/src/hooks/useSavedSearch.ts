import { useEffect, useState } from 'react';

export type SavedSearch = {
  id: string;
  name: string;
  params: string; // URLSearchParams string
  createdAt: string;
};

export function useSavedSearches() {
  const [items, setItems] = useState<SavedSearch[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('saved-searches');
      if (raw) setItems(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: SavedSearch[]) => {
    setItems(next);
    try { localStorage.setItem('saved-searches', JSON.stringify(next)); } catch {}
  };

  const save = (name: string, params: string) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const next = [{ id, name, params, createdAt }, ...items];
    persist(next);
  };

  const remove = (id: string) => {
    persist(items.filter((s) => s.id !== id));
  };

  return { items, save, remove } as const;
}



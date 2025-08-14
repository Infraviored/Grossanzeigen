import { useQuery } from '@tanstack/react-query';

export type Category = { id: string; parentId: string | null; name: string };

export function useCategories(parentId?: string | null) {
  return useQuery<{ categories: Category[] }>({
    queryKey: ['categories', parentId ?? null],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (parentId) search.set('parentId', parentId);
      const res = await fetch(`/api/v1/categories${search.toString() ? `?${search.toString()}` : ''}`);
      if (!res.ok) throw new Error('Failed to load categories');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}



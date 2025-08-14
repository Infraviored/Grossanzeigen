import { useQuery } from '@tanstack/react-query';

type ListingsParams = {
  q?: string;
  categoryId?: string;
  min?: string;
  max?: string;
  sort?: string;
  cursor?: string | null;
  limit?: string | number;
};

export function useListings(params: ListingsParams) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.q) search.set('text', params.q);
      if (params.categoryId) search.set('categoryId', params.categoryId);
      if (params.min) search.set('minPrice', params.min);
      if (params.max) search.set('maxPrice', params.max);
      if (params.cursor) search.set('cursor', params.cursor);
      if (params.limit != null) search.set('limit', String(params.limit));
      if (params.sort) search.set('sort', params.sort);
      const res = await fetch(`/api/v1/listings?${search.toString()}`);
      if (!res.ok) throw new Error('Failed to load listings');
      return res.json();
    },
  });
}


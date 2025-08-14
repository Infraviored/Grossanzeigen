import { useQuery } from '@tanstack/react-query';

type ListingsParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export function useListings(params: ListingsParams) {
  return useQuery({
    queryKey: ['listings', params],
    queryFn: async () => {
      const search = new URLSearchParams(params as Record<string, string>);
      const res = await fetch(`/api/v1/search/listings?${search.toString()}`);
      if (!res.ok) throw new Error('Failed to load listings');
      return res.json();
    },
  });
}


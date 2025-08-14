import { useQuery } from '@tanstack/react-query';

export function useListing(id: string) {
  return useQuery({
    queryKey: ['listing', id],
    queryFn: async () => {
      const res = await fetch(`/api/v1/listings/${id}`);
      if (!res.ok) throw new Error('Failed to load listing');
      const json = await res.json();
      return json.listing;
    },
    enabled: Boolean(id),
  });
}


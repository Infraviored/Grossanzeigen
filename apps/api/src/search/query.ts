export type ListingsSearchFilters = {
  text?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string[];
  geo?: { lat: number; lon: number; distanceKm: number };
  sort?: 'relevance' | 'date_desc' | 'price_asc' | 'price_desc' | 'distance';
  limit?: number;
  searchAfter?: any[];
};

export function buildListingsQuery(filters: ListingsSearchFilters) {
  const must: any[] = [];
  const filter: any[] = [];

  if (filters.text) {
    must.push({
      multi_match: {
        query: filters.text,
        fields: ['title^2', 'description'],
        type: 'best_fields',
        operator: 'and',
      },
    });
  }

  if (filters.categoryId) {
    filter.push({ term: { category_id: filters.categoryId } });
  }

  if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
    const range: any = {};
    if (typeof filters.minPrice === 'number') range.gte = filters.minPrice;
    if (typeof filters.maxPrice === 'number') range.lte = filters.maxPrice;
    filter.push({ range: { price: range } });
  }

  if (filters.condition && filters.condition.length > 0) {
    filter.push({ terms: { condition: filters.condition } });
  }

  if (filters.geo) {
    filter.push({
      geo_distance: {
        distance: `${filters.geo.distanceKm}km`,
        location: { lat: filters.geo.lat, lon: filters.geo.lon },
      },
    });
  }

  let sort: any[] = [];
  switch (filters.sort) {
    case 'date_desc':
      sort = [{ created_at: 'desc' }];
      break;
    case 'price_asc':
      sort = [{ price: 'asc' }, { created_at: 'desc' }];
      break;
    case 'price_desc':
      sort = [{ price: 'desc' }, { created_at: 'desc' }];
      break;
    case 'distance':
      if (filters.geo) {
        sort = [
          {
            _geo_distance: {
              location: { lat: filters.geo.lat, lon: filters.geo.lon },
              order: 'asc',
              unit: 'km',
            },
          },
          { created_at: 'desc' },
        ];
      }
      break;
    default:
      // relevance (default)
      sort = [{ _score: 'desc' }, { created_at: 'desc' }];
  }

  const body: any = {
    size: Math.min(Math.max(filters.limit ?? 20, 1), 100),
    query: { bool: { must, filter } },
    sort,
  };

  if (filters.searchAfter && filters.searchAfter.length > 0) {
    body.search_after = filters.searchAfter;
  }

  return body;
}

export function buildListingsFacets() {
  return {
    category: { terms: { field: 'category_id' } },
    condition: { terms: { field: 'condition' } },
    price_ranges: {
      range: {
        field: 'price',
        ranges: [
          { to: 10000 },
          { from: 10000, to: 50000 },
          { from: 50000, to: 100000 },
          { from: 100000 },
        ],
      },
    },
  };
}

export type FacetBuckets = {
  category: Array<{ key: string; doc_count: number }>;
  condition: Array<{ key: string; doc_count: number }>;
  price_ranges: Array<{ key: string; to?: number; from?: number; doc_count: number }>;
};

export function parseFacetBuckets(aggregations: any): FacetBuckets {
  return {
    category: aggregations?.category?.buckets ?? [],
    condition: aggregations?.condition?.buckets ?? [],
    price_ranges: aggregations?.price_ranges?.buckets ?? [],
  };
}



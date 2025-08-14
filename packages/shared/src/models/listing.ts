export type ListingStatus = 'draft' | 'active' | 'sold' | 'expired';

export interface Listing {
  id: string;
  seller_id: string;
  category_id: string;
  title: string;
  description: string;
  price: number; // minor units
  currency: string; // ISO 4217
  status: ListingStatus;
  location?: ListingLocation;
  created_at: string;
  updated_at: string;
  attributes?: Record<string, unknown>;
  images?: ListingImage[];
}

export interface ListingLocation {
  lat: number;
  lon: number;
  text?: string;
}

export interface ListingImage {
  id: string;
  listing_id: string;
  s3_key_original: string;
  variants?: {
    thumb?: string;
    medium?: string;
    large?: string;
  };
}


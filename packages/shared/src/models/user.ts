export type Role = 'user' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  roles: Role[];
  created_at: string; // ISO 8601 UTC
  stripe_customer_id?: string;
  stripe_account_id?: string;
  connect_onboarding_status?: string;
}

export interface Profile {
  user_id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  label?: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postal_code?: string;
  country: string; // ISO 3166-1 alpha-2
}


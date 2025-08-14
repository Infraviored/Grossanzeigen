"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type FavoriteItem = {
  id: string;
  title: string;
  price: number;
  currency: string;
  locationText?: string | null;
  images?: Array<{ variants?: { thumb?: string; medium?: string; large?: string } }>;
};

export default function FavoritesPage() {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  useEffect(() => {
    apiGet<{ listings: FavoriteItem[] }>('/api/v1/favorites').then((res) => setItems(res.listings || [])).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.length === 0 ? (
          <div className="rounded border p-4 text-sm text-gray-700">No favorites yet.</div>
        ) : (
          items.map((item) => {
            const thumb = item.images?.[0]?.variants?.thumb || item.images?.[0]?.variants?.medium || null;
            return (
              <Link key={item.id} href={`/listings/${item.id}`} className="rounded border p-3 text-sm hover:shadow-sm transition-shadow">
                <div className="relative h-40 w-full overflow-hidden rounded bg-gray-100">
                  {thumb ? <Image src={thumb} alt={item.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" unoptimized /> : <div />}
                </div>
                <div className="mt-2 font-medium line-clamp-2 min-h-[2.5rem]">{item.title}</div>
                <div className="mt-1">{(item.price / 100).toFixed(2)} {item.currency}</div>
                {item.locationText ? <div className="text-gray-600">{item.locationText}</div> : null}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}


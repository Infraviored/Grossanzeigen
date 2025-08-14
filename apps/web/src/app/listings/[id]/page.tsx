"use client";
import { notFound } from 'next/navigation';
import { useListing } from '@/hooks/useListing';
import Image from 'next/image';
import Link from 'next/link';
import { useFavorites } from '@/hooks/useFavorites';

export default function ListingPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useListing(params.id);
  const { isFavorite, toggle } = useFavorites();
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 h-4 w-72 animate-pulse rounded bg-gray-200" />
      </div>
    );
  }
  if (!data) return notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-8 md:grid-cols-2">
      <div className="aspect-square w-full rounded bg-gray-100 relative overflow-hidden">
        {data.images?.length ? (
          <Image
            src={(data.images[0].variants?.large || data.images[0].variants?.medium || '') as string}
            alt={data.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-semibold">{data.title}</h1>
          <button onClick={() => toggle(params.id)} className="rounded border px-3 py-1.5 text-sm">
            {isFavorite(params.id) ? '♥ Saved' : '♡ Save'}
          </button>
        </div>
        <div className="mt-2 text-xl">{(data.price / 100).toFixed(2)} {data.currency}</div>
        {data.locationText ? <div className="text-sm text-gray-600">{data.locationText}</div> : null}
        {data.category?.name ? (
          <div className="mt-2 text-sm">
            <span className="rounded-full bg-gray-100 px-3 py-1">{data.category.name}</span>
          </div>
        ) : null}
        <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{data.description}</p>
        {data.status === 'DRAFT' && (
          <div className="mt-6">
            <a className="rounded border px-3 py-2" href={`/(sell)/wizard?listingId=${params.id}`}>Edit draft</a>
          </div>
        )}
        <div className="mt-8">
          <Link href="/search" className="rounded border px-3 py-2 text-sm">Back to search</Link>
        </div>
      </div>
    </div>
  );
}


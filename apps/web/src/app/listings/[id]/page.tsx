"use client";
import { notFound } from 'next/navigation';
import { useListing } from '@/hooks/useListing';

export default function ListingPage({ params }: { params: { id: string } }) {
  const { data, isLoading } = useListing(params.id);
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
      <div className="aspect-square w-full rounded bg-gray-100" />
      <div>
        <h1 className="text-2xl font-semibold">{data.title}</h1>
        <div className="mt-2 text-xl">{(data.price / 100).toFixed(2)} {data.currency}</div>
        <p className="mt-4 text-sm text-gray-700 whitespace-pre-wrap">{data.description}</p>
      </div>
    </div>
  );
}


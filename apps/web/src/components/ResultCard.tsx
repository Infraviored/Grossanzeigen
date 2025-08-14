"use client";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";

export type ResultCardProps = {
  id: string;
  title: string;
  price: number;
  currency: string;
  imageUrl?: string | null;
  locationText?: string | null;
};

export function ResultCard({ id, title, price, currency, imageUrl, locationText }: ResultCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const priceText = `${(price / 100).toFixed(2)} ${currency}`;
  return (
    <Link href={`/listings/${id}`} className="rounded border p-3 text-sm hover:shadow-sm transition-shadow">
      <div className="relative h-40 w-full overflow-hidden rounded bg-gray-100">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" unoptimized />
        ) : (
          <div className="h-full w-full" />
        )}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); toggle(id); }}
          aria-pressed={isFavorite(id)}
          className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-1 text-xs shadow hover:bg-white"
        >
          {isFavorite(id) ? '♥ Saved' : '♡ Save'}
        </button>
      </div>
      <div className="mt-2 font-medium line-clamp-2 min-h-[2.5rem]">{title}</div>
      <div className="mt-1 text-gray-900">{priceText}</div>
      {locationText ? <div className="text-gray-600">{locationText}</div> : null}
    </Link>
  );
}



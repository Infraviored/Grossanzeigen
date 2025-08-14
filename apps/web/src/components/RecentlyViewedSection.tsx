"use client";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { ResultCard } from "@/components/ResultCard";

export function RecentlyViewedSection() {
  const { items } = useRecentlyViewed();
  if (items.length === 0) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <h2 className="text-xl font-semibold">Recently viewed</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.slice(0, 6).map((i) => (
          <ResultCard key={i.id} id={i.id} title={i.title} price={i.price} currency={i.currency} imageUrl={i.imageUrl} locationText={i.locationText} />
        ))}
      </div>
    </section>
  );
}



import Link from "next/link";
import type { Metadata } from "next";
import { LandingCategories } from "@/components/LandingCategories";
import { RecentlyViewedSection } from "@/components/RecentlyViewedSection";

export const metadata: Metadata = {
  title: "Grossanzeigen — Buy and sell locally",
  description: "Discover great deals nearby. Search millions of listings or post your own in minutes.",
};

export default function Home() {
  const categories: { label: string; value: string }[] = [
    { label: "Electronics", value: "electronics" },
    { label: "Home & Garden", value: "home-garden" },
    { label: "Furniture", value: "furniture" },
    { label: "Fashion", value: "fashion" },
    { label: "Vehicles", value: "vehicles" },
    { label: "Sports", value: "sports" },
    { label: "Baby & Kids", value: "baby-kids" },
    { label: "Other", value: "other" },
  ];

  return (
    <div>
      <section className="bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center sm:text-left">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Buy and sell locally</h1>
          <p className="mt-3 text-gray-600 max-w-2xl">Discover great deals nearby. Search millions of listings or post your own in minutes.</p>

          <form action="/search" method="get" className="mt-8 flex w-full max-w-2xl gap-2">
            <input
              type="text"
              name="q"
              placeholder="Search for phones, bikes, sofas..."
              className="h-12 flex-1 rounded-md border border-gray-300 px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
            />
            <button type="submit" className="h-12 rounded-md bg-black px-6 text-white">Search</button>
          </form>

          <div className="mt-4 flex items-center gap-3 text-sm">
            <Link href="/sell" className="rounded-md bg-black px-4 py-2 text-white">Start selling</Link>
            <Link href="/search" className="rounded-md border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-100">Browse all</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <h2 className="text-xl font-semibold">Browse by category</h2>
        <LandingCategories fallback={categories} />
      </section>
      <RecentlyViewedSection />
    </div>
  );
}

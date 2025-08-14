"use client";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategories";

export function LandingCategories({ fallback }: { fallback?: { label: string; value: string }[] }) {
  const { data, isLoading } = useCategories();
  const items = data?.categories ?? null;

  if (isLoading && !items && (!fallback || fallback.length === 0)) {
    return (
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items
        ? items.slice(0, 8).map((c) => (
            <Link key={c.id} href={`/search?categoryId=${encodeURIComponent(c.id)}`} className="rounded-md border p-4 text-center text-sm hover:bg-gray-50">{c.name}</Link>
          ))
        : (fallback ?? []).map((c) => (
            <Link key={c.value} href={`/search?categoryId=${encodeURIComponent(c.value)}`} className="rounded-md border p-4 text-center text-sm hover:bg-gray-50">{c.label}</Link>
          ))}
    </div>
  );
}



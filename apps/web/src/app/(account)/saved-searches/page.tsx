"use client";
import Link from 'next/link';
import { useSavedSearches } from '@/hooks/useSavedSearch';

export default function SavedSearchesPage() {
  const { items, remove } = useSavedSearches();
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Saved searches</h1>
      <p className="mt-2 text-sm text-gray-600">Create, open, and delete saved searches.</p>
      <div className="mt-6 divide-y rounded border">
        {items.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">No saved searches yet.</div>
        ) : (
          items.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 text-sm">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-600">{new URLSearchParams(s.params).toString()}</div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/search?${s.params}`} className="rounded border px-3 py-1.5 hover:bg-gray-50">Open</Link>
                <button onClick={() => remove(s.id)} className="rounded border px-3 py-1.5 hover:bg-gray-50" type="button">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}


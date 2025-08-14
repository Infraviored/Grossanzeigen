"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiGet, apiPut } from '@/lib/api';
import { readDraft, writeDraft } from '@/lib/draft';
import { useEffect, useMemo } from 'react';

export default function CategoryStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [categoryId, setCategoryId] = useState(readDraft().categoryId || '');
  const [schema, setSchema] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    apiGet<Array<{ id: string; name: string }>>('/api/v1/categories').then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!listingId || !categoryId) return;
      apiPut(`/api/v1/listings/${listingId}`, { categoryId }).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [listingId, categoryId]);

  useEffect(() => {
    writeDraft({ categoryId });
  }, [categoryId]);

  useEffect(() => {
    async function loadSchema() {
      if (!categoryId) { setSchema(null); return; }
      const res = await fetch(`/api/v1/categories/${encodeURIComponent(categoryId)}`);
      if (!res.ok) return setSchema(null);
      const data = await res.json();
      setSchema((data?.category?.attributeSchema as any) ?? null);
    }
    loadSchema();
  }, [categoryId]);

  const attributeHints = useMemo(() => {
    const s = schema || {};
    return Object.entries(s).slice(0, 6) as Array<[string, any]>;
  }, [schema]);
  return (
    <div className="space-y-6">
      <select className="h-10 w-full rounded border border-gray-300 px-3 text-sm" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      {attributeHints.length > 0 ? (
        <div className="rounded border p-3">
          <div className="text-sm font-medium">This category usually includes</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-gray-700">
            {attributeHints.map(([key, spec]) => (
              <li key={key}>{key}{spec?.type ? ` (${spec.type})` : ''}</li>
            ))}
          </ul>
        </div>
      ) : null}
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/attributes?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}


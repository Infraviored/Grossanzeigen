"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiPut } from '@/lib/api';
import { readDraft, writeDraft } from '@/lib/draft';

export default function AttributesStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [attributeExample, setAttributeExample] = useState((readDraft() as any).attributes?.example || '');
  useEffect(() => {
    const t = setTimeout(() => {
      if (!listingId) return;
      // Persist as arbitrary attributes JSON; server can merge
      apiPut(`/api/v1/listings/${listingId}`, { attributes: { example: attributeExample } }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [listingId, attributeExample]);

  useEffect(() => {
    writeDraft({ attributes: { example: attributeExample } as any } as any);
  }, [attributeExample]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm">Condition</label>
          <select className="h-10 w-full rounded border border-gray-300 px-3 text-sm">
            <option>New</option>
            <option>Like new</option>
            <option>Good</option>
            <option>Fair</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm">Brand</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="e.g., Apple" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Model</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="e.g., iPhone 13" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Color</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="e.g., Midnight" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm">Custom attribute</label>
        <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="Attribute example" value={attributeExample} onChange={(e) => setAttributeExample(e.target.value)} />
      </div>
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/price?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}


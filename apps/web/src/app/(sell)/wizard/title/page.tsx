'use client'
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { apiPut } from '@/lib/api';
import { writeDraft } from '@/lib/draft';
import { readDraft, writeDraft } from '@/lib/draft';

export default function TitleStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [title, setTitle] = useState(readDraft().title || '');

  useEffect(() => {
    const t = setTimeout(() => {
      if (!listingId) return;
      apiPut(`/api/v1/listings/${listingId}`, { title }).catch(() => {});
    }, 500);
    return () => clearTimeout(t);
  }, [listingId, title]);

  useEffect(() => {
    writeDraft({ title });
  }, [title]);
  return (
    <div className="space-y-4">
      <Input placeholder="Listing title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea
        className="h-40 w-full rounded border border-gray-300 px-3 py-2 text-sm"
        placeholder="Describe your item (condition, brand, features, included accessories, defects, pickup/shipping details)"
        onChange={(e) => writeDraft({ description: e.target.value })}
      />
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/category?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}


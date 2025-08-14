"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiPut } from '@/lib/api';
import { readDraft, writeDraft } from '@/lib/draft';

export default function LocationStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [location, setLocation] = useState(readDraft().locationText || '');
  useEffect(() => {
    const t = setTimeout(() => {
      if (!listingId) return;
      apiPut(`/api/v1/listings/${listingId}`, { locationText: location }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [listingId, location]);

  useEffect(() => {
    writeDraft({ locationText: location });
  }, [location]);
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm">Location</label>
        <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="City, ZIP" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm">Latitude</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="Optional" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Longitude</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="Optional" />
        </div>
      </div>
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/images?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}


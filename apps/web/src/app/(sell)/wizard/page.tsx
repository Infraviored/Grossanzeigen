"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiPost, apiPut } from '@/lib/api';
import { readDraft, writeDraft, getDraftListingId, setDraftListingId } from '@/lib/draft';

export default function WizardIndex() {
  const params = useSearchParams();
  const [listingId, setListingId] = useState<string | null>(null);
  useEffect(() => {
    const id = params.get('listingId') || getDraftListingId();
    if (id != null) setListingId(id);
  }, [params]);

  useEffect(() => {
    if (listingId == null) return;
    setDraftListingId(listingId);
  }, [listingId]);

  const stepLink = (to: string) => (listingId ? `${to}?listingId=${listingId}` : to);

  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p>Steps:</p>
      <ol className="list-decimal pl-6 space-y-1">
        <li><Link href={stepLink('/(sell)/wizard/title')}>Title</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/category')}>Category</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/attributes')}>Attributes</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/price')}>Price</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/location')}>Location</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/images')}>Images</Link></li>
        <li><Link href={stepLink('/(sell)/wizard/review')}>Review & Create</Link></li>
      </ol>
    </div>
  );
}


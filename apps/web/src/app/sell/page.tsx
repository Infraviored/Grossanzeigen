"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getDraftListingId, readDraft, setDraftListingId } from '@/lib/draft';

export default function SellPage() {
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftSummary, setDraftSummary] = useState<{ title?: string; categoryId?: string; price?: number } | null>(null);

  useEffect(() => {
    const existing = getDraftListingId();
    if (existing) setDraftId(existing);
    setDraftSummary(readDraft());
  }, []);

  function startNewDraft() {
    // No server call yet; collect details in wizard and create later
    setDraftListingId('');
    setDraftId('');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Sell</h1>
      <p className="mt-2 text-sm text-gray-600">Create a new listing using the wizard.</p>
      <div className="mt-6 grid gap-3 sm:flex sm:items-center">
        <button onClick={startNewDraft} className="rounded bg-black px-4 py-2 text-white" type="button">Start</button>
        <Link className="rounded border px-4 py-2" href={`/(sell)/wizard`}>Open wizard</Link>
        {draftId ? (
          <Link className="rounded border px-4 py-2" href={`/(sell)/wizard${draftId ? `?listingId=${draftId}` : ''}`}>Continue draft</Link>
        ) : null}
      </div>
      {draftSummary && (draftSummary.title || draftSummary.price || draftSummary.categoryId) ? (
        <div className="mt-4 text-sm text-gray-600">Last draft: {draftSummary.title || 'Untitled'}{draftSummary.price ? ` · €${(draftSummary.price/100).toFixed(2)}` : ''}</div>
      ) : null}
    </div>
  );
}


"use client";
import { useSearchParams, useRouter } from 'next/navigation';
import { apiPost, apiPut } from '@/lib/api';
import { readDraft, clearDraft, getDraftListingId, setDraftListingId } from '@/lib/draft';

export default function ReviewStep() {
  const params = useSearchParams();
  const router = useRouter();
  const listingId = params.get('listingId') || '';

  async function createOrUpdateThenPublish() {
    const draft = readDraft();
    // Validate minimal fields per API contract
    if (!draft.title || !draft.categoryId || !draft.price || !draft.currency) {
      alert('Please provide title, category, and price before publishing.');
      return;
    }
    let id = getDraftListingId();
    if (!id) {
      // Create listing with required fields
      const created = await apiPost<{ id: string }>(`/api/v1/listings`, {
        title: draft.title,
        description: draft.description || '',
        price: draft.price,
        currency: draft.currency,
        categoryId: draft.categoryId,
        attributes: (draft as any).attributes,
        latitude: draft.latitude ?? null,
        longitude: draft.longitude ?? null,
        locationText: draft.locationText ?? null,
      });
      id = (created as any).id || (created as any).listing?.id || created.id;
      setDraftListingId(id);
    } else {
      await apiPut(`/api/v1/listings/${id}`, {
        title: draft.title,
        description: draft.description || '',
        price: draft.price,
        currency: draft.currency,
        categoryId: draft.categoryId,
        attributes: (draft as any).attributes,
        latitude: draft.latitude ?? null,
        longitude: draft.longitude ?? null,
        locationText: draft.locationText ?? null,
      });
    }
    // Try publish (requires verified)
    try {
      await apiPost(`/api/v1/listings/${id}/publish`);
    } catch {}
    clearDraft();
    router.push(`/listings/${id}`);
  }

  return (
    <div className="space-y-4">
      <div className="rounded border p-4 text-sm text-gray-700">Review your listing details here before publishing.</div>
      <button onClick={createOrUpdateThenPublish} className="rounded bg-black px-4 py-2 text-white" type="button">Create/Update & Publish</button>
    </div>
  );
}


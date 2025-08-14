"use client";

export type Draft = {
  title?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  currency?: string;
  locationText?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const DRAFT_KEY = 'sellDraft';
const DRAFT_LISTING_ID_KEY = 'currentDraftId';

export function readDraft(): Draft {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : {};
  } catch {
    return {};
  }
}

export function writeDraft(patch: Partial<Draft>) {
  if (typeof window === 'undefined') return;
  const current = readDraft();
  const next = { ...current, ...patch };
  window.localStorage.setItem(DRAFT_KEY, JSON.stringify(next));
}

export function clearDraft() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DRAFT_KEY);
}

export function getDraftListingId(): string | null {
  if (typeof window === 'undefined') return null;
  return window.localStorage.getItem(DRAFT_LISTING_ID_KEY);
}

export function setDraftListingId(id: string) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DRAFT_LISTING_ID_KEY, id);
}

export function clearDraftListingId() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DRAFT_LISTING_ID_KEY);
}



"use client";
import Link from "next/link";
import { readDraft, getDraftListingId } from "@/lib/draft";
import { useEffect, useMemo, useState } from "react";

type Step = {
  id: string;
  label: string;
  href: string;
};

const STEPS: Step[] = [
  { id: "title", label: "Title & Description", href: "/(sell)/wizard/title" },
  { id: "category", label: "Category", href: "/(sell)/wizard/category" },
  { id: "attributes", label: "Details", href: "/(sell)/wizard/attributes" },
  { id: "price", label: "Price", href: "/(sell)/wizard/price" },
  { id: "location", label: "Location", href: "/(sell)/wizard/location" },
  { id: "images", label: "Photos", href: "/(sell)/wizard/images" },
  { id: "review", label: "Review", href: "/(sell)/wizard/review" },
];

export function WizardProgress() {
  const [listingId, setListingId] = useState<string | null>(null);
  const [summary, setSummary] = useState(readDraft());

  useEffect(() => {
    setListingId(getDraftListingId());
    setSummary(readDraft());
  }, []);

  const completed = useMemo(() => ({
    title: Boolean(summary.title),
    category: Boolean(summary.categoryId),
    attributes: true, // optional MVP
    price: typeof summary.price === 'number' && summary.price > 0,
    location: Boolean(summary.locationText),
    images: true, // backend attach is separate; allow continue
    review: false,
  }), [summary]);

  const withParams = (href: string) => listingId ? `${href}?listingId=${listingId}` : href;

  return (
    <ol className="grid grid-cols-2 gap-2 text-xs text-gray-700 sm:grid-cols-4">
      {STEPS.map((s) => (
        <li key={s.id} className="flex items-center gap-2 rounded border px-2 py-1">
          <span className={`inline-block h-2 w-2 rounded-full ${completed[s.id as keyof typeof completed] ? 'bg-green-600' : 'bg-gray-300'}`} />
          <Link href={withParams(s.href)} className="hover:underline">
            {s.label}
          </Link>
        </li>
      ))}
    </ol>
  );
}



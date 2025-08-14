"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiPut } from '@/lib/api';
import { readDraft, writeDraft } from '@/lib/draft';

export default function PriceStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [price, setPrice] = useState(() => {
    const p = readDraft().price;
    return p != null ? String(p / 100) : '';
  });
  useEffect(() => {
    const t = setTimeout(() => {
      if (!listingId) return;
      const cents = Math.round((Number(price) || 0) * 100);
      apiPut(`/api/v1/listings/${listingId}`, { price: cents, currency: 'EUR' }).catch(() => {});
    }, 400);
    return () => clearTimeout(t);
  }, [listingId, price]);

  useEffect(() => {
    const cents = Math.round((Number(price) || 0) * 100);
    writeDraft({ price: cents, currency: 'EUR' });
  }, [price]);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm">Price</label>
          <div className="flex items-center gap-2">
            <span className="rounded border px-2 py-1 text-xs">EUR</span>
            <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm">Quantity</label>
          <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="1" />
        </div>
      </div>
      <ShippingEstimator priceCents={Math.round((Number(price) || 0) * 100)} />
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/location?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}

function ShippingEstimator({ priceCents }: { priceCents: number }) {
  const [method, setMethod] = useState<'pickup' | 'standard' | 'express'>('pickup');
  const [cost, setCost] = useState<number>(0);
  const total = priceCents + cost;
  useEffect(() => {
    // Simple heuristic: standard 4.99, express 9.99, pickup 0
    if (method === 'pickup') setCost(0);
    else if (method === 'standard') setCost(499);
    else setCost(999);
  }, [method]);
  return (
    <div className="rounded border p-4">
      <div className="text-sm font-medium">Delivery options</div>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3 text-sm">
        <label className="flex items-center gap-2"><input type="radio" name="ship" checked={method==='pickup'} onChange={() => setMethod('pickup')} /> Local pickup (free)</label>
        <label className="flex items-center gap-2"><input type="radio" name="ship" checked={method==='standard'} onChange={() => setMethod('standard')} /> Standard (4.99€)</label>
        <label className="flex items-center gap-2"><input type="radio" name="ship" checked={method==='express'} onChange={() => setMethod('express')} /> Express (9.99€)</label>
      </div>
      <div className="mt-3 text-sm">
        <div>Item: {(priceCents/100).toFixed(2)} €</div>
        <div>Delivery: {(cost/100).toFixed(2)} €</div>
        <div className="font-medium">Total: {(total/100).toFixed(2)} €</div>
      </div>
    </div>
  );
}


"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';
import { Input } from '@/components/ui/input';

type Address = { id?: string; line1: string; city: string; postalCode: string; country: string };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [draft, setDraft] = useState<Address>({ line1: '', city: '', postalCode: '', country: '' });

  useEffect(() => {
    apiGet<Address[]>('/api/v1/me/addresses').then(setAddresses).catch(() => {});
  }, []);

  async function addAddress() {
    const created = await apiPost<Address>('/api/v1/me/addresses', draft).catch(() => null);
    if (created) setAddresses((prev) => [created, ...prev]);
    setDraft({ line1: '', city: '', postalCode: '', country: '' });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Addresses</h1>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded border p-4">
          <h2 className="font-medium">Add new</h2>
          <div className="mt-3 space-y-2">
            <Input placeholder="Address line" value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} />
            <Input placeholder="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
            <Input placeholder="Postal code" value={draft.postalCode} onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })} />
            <Input placeholder="Country" value={draft.country} onChange={(e) => setDraft({ ...draft, country: e.target.value })} />
            <button onClick={addAddress} className="rounded bg-black px-4 py-2 text-white" type="button">Add address</button>
          </div>
        </div>
        <div className="rounded border p-4">
          <h2 className="font-medium">Saved</h2>
          <div className="mt-3 space-y-3">
            {addresses.length === 0 ? (
              <div className="text-sm text-gray-600">No addresses yet.</div>
            ) : (
              addresses.map((a) => (
                <div key={a.id} className="rounded border p-3 text-sm">
                  <div>{a.line1}</div>
                  <div className="text-gray-600">{a.postalCode} {a.city}, {a.country}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


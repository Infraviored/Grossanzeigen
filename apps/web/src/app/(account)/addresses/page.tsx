export default function AddressesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Addresses</h1>
      <div className="mt-6 space-y-4">
        <div className="rounded border p-4 text-sm text-gray-700">No addresses yet.</div>
        <button className="rounded bg-black px-4 py-2 text-white" type="button">Add address</button>
      </div>
    </div>
  );
}


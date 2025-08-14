export default function PaymentMethodsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Payment methods</h1>
      <p className="mt-2 text-sm text-gray-600">Saved tokens will appear here.</p>
      <div className="mt-6 rounded border p-4 text-sm text-gray-700">No saved methods.</div>
    </div>
  );
}


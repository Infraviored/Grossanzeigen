import Link from 'next/link';

export default function SellPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Sell</h1>
      <p className="mt-2 text-sm text-gray-600">Create a new listing using the wizard.</p>
      <div className="mt-6">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/(sell)/wizard">Open wizard</Link>
      </div>
    </div>
  );
}


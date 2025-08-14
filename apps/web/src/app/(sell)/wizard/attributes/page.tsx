import Link from 'next/link';

export default function AttributesStep() {
  return (
    <div className="space-y-4">
      <input className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="Attribute example" />
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/ (sell)/wizard/price">Next</Link>
      </div>
    </div>
  );
}


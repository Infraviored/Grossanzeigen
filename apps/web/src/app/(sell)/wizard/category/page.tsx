import Link from 'next/link';

export default function CategoryStep() {
  return (
    <div className="space-y-4">
      <select className="h-10 w-full rounded border border-gray-300 px-3 text-sm">
        <option>Electronics</option>
        <option>Home</option>
        <option>Fashion</option>
      </select>
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/ (sell)/wizard/attributes">Next</Link>
      </div>
    </div>
  );
}


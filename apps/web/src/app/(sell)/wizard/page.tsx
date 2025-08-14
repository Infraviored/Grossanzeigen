import Link from 'next/link';

export default function WizardIndex() {
  return (
    <div className="space-y-3 text-sm text-gray-700">
      <p>Steps:</p>
      <ol className="list-decimal pl-6 space-y-1">
        <li><Link href="/ (sell)/wizard/title">Title</Link></li>
        <li><Link href="/ (sell)/wizard/category">Category</Link></li>
        <li><Link href="/ (sell)/wizard/attributes">Attributes</Link></li>
        <li><Link href="/ (sell)/wizard/price">Price</Link></li>
        <li><Link href="/ (sell)/wizard/location">Location</Link></li>
        <li><Link href="/ (sell)/wizard/images">Images</Link></li>
        <li><Link href="/ (sell)/wizard/review">Review</Link></li>
      </ol>
    </div>
  );
}


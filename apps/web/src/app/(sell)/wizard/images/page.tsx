"use client";
import Link from 'next/link';
import { PresignedUploader } from '@/components/uploader/PresignedUploader';
import { useState } from 'react';

export default function ImagesStep() {
  const [keys, setKeys] = useState<string[]>([]);
  return (
    <div className="space-y-4">
      <PresignedUploader onUploaded={(key) => setKeys((k) => [...k, key])} />
      <div className="text-sm text-gray-600">Uploaded: {keys.length}</div>
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/ (sell)/wizard/review">Next</Link>
      </div>
    </div>
  );
}


'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function ImagesStep() {
  const [files, setFiles] = useState<FileList | null>(null);
  return (
    <div className="space-y-4">
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/ (sell)/wizard/review">Next</Link>
      </div>
    </div>
  );
}


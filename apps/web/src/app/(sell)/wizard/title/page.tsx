'use client'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function TitleStep() {
  const [title, setTitle] = useState('');
  return (
    <div className="space-y-4">
      <Input placeholder="Listing title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href="/ (sell)/wizard/category">Next</Link>
      </div>
    </div>
  );
}


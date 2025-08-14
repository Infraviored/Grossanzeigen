"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';

type Conversation = { id: string; lastMessage?: { text: string; createdAt: string } };

export default function ConversationsPage() {
  const [items, setItems] = useState<Conversation[]>([]);
  useEffect(() => {
    apiGet<Conversation[]>('/api/v1/conversations').then(setItems).catch(() => {});
  }, []);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Conversations</h1>
      <div className="mt-4 divide-y rounded border">
        {items.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">No conversations yet.</div>
        ) : (
          items.map((c) => (
            <Link key={c.id} href={`/conversations/${c.id}`} className="block p-3 hover:bg-gray-50">
              <div className="text-sm">{c.lastMessage?.text ?? 'New conversation'}</div>
              <div className="text-xs text-gray-600">{c.lastMessage?.createdAt ? new Date(c.lastMessage.createdAt).toLocaleString() : ''}</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}



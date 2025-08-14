"use client";
import { useEffect, useRef, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Message = { id: string; senderId: string; text: string; createdAt: string };

export default function ConversationThread({ params }: { params: { id: string } }) {
  const { id } = params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    apiGet<Message[]>(`/api/v1/conversations/${id}/messages`).then(setMessages).catch(() => {});
  }, [id]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages.length]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const msg = await apiPost<Message>(`/api/v1/conversations/${id}/messages`, { text }).catch(() => null);
    if (msg) setMessages((prev) => [...prev, msg]);
    setText('');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="rounded border p-3 h-[60vh] overflow-y-auto space-y-2">
        {messages.map((m) => (
          <div key={m.id} className="text-sm"><span className="text-gray-600">[{new Date(m.createdAt).toLocaleTimeString()}]</span> {m.text}</div>
        ))}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="mt-3 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} className="flex-1 rounded border px-3 py-2 text-sm" placeholder="Type a message" />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">Send</button>
      </form>
    </div>
  );
}



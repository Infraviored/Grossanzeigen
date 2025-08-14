"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Notification = { id: string; readAt?: string };

export function Bell() {
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch('/api/v1/notifications', { credentials: 'include' });
        if (!res.ok) return;
        const json = await res.json();
        const items = (json.notifications ?? []) as Notification[];
        if (!cancelled) setCount(items.filter((n) => !n.readAt).length);
      } catch {}
    }
    load();
    const id = setInterval(load, 10000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <Link href="/(account)/notifications" className="relative inline-flex items-center">
      <span aria-hidden>🔔</span>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] leading-4 text-white">
          {count}
        </span>
      )}
      <span className="sr-only">Notifications</span>
    </Link>
  );
}



"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPost } from '@/lib/api';

type Notification = { id: string; type: string; payload: any; readAt?: string; createdAt: string };

export default function NotificationsSettingsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  useEffect(() => {
    apiGet<{ notifications: Notification[] }>('/api/v1/notifications')
      .then((r) => setItems(r.notifications ?? []))
      .catch(() => {});
  }, []);

  async function markAllRead() {
    await apiPost('/api/v1/notifications/read', { ids: items.map((n) => n.id) }).catch(() => {});
    setItems((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button onClick={markAllRead} className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50" type="button">Mark all read</button>
      </div>
      <div className="mt-4 divide-y rounded border">
        {items.length === 0 ? (
          <div className="p-3 text-sm text-gray-600">No notifications.</div>
        ) : (
          items.map((n) => (
            <div key={n.id} className="p-3 text-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium">{n.type}</div>
                <div className="text-xs text-gray-600">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <pre className="mt-1 overflow-auto rounded bg-gray-50 p-2 text-xs">{JSON.stringify(n.payload, null, 2)}</pre>
              {!n.readAt && <span className="mt-1 inline-block rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700">new</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}


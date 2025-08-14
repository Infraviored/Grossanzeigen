"use client";
import { useEffect, useState } from 'react';

type Toast = { id: number; message: string };

let enqueue: ((msg: string) => void) | null = null;
export function toast(message: string) {
  enqueue?.(message);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    enqueue = (message: string) => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, message }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
    };
    return () => {
      enqueue = null;
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((t) => (
        <div key={t.id} className="rounded bg-black px-3 py-2 text-white shadow">
          {t.message}
        </div>
      ))}
    </div>
  );
}


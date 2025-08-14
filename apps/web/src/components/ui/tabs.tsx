import { useState } from 'react';
import { cn } from '@/lib/cn';

export type TabItem = { id: string; label: string; content: React.ReactNode };

type TabsProps = {
  items: TabItem[];
  defaultId?: string;
};

export function Tabs({ items, defaultId }: TabsProps) {
  const [active, setActive] = useState<string>(defaultId ?? items[0]?.id);
  const current = items.find((i) => i.id === active) ?? items[0];
  return (
    <div>
      <div className="flex gap-2 border-b">
        {items.map((i) => (
          <button
            key={i.id}
            className={cn('px-3 py-2 text-sm', active === i.id ? 'border-b-2 border-black' : 'text-gray-500')}
            onClick={() => setActive(i.id)}
          >
            {i.label}
          </button>
        ))}
      </div>
      <div className="py-4">{current?.content}</div>
    </div>
  );
}


'use client'

import { cn } from '@/lib/cn';

type SheetProps = {
  open: boolean;
  onClose: () => void;
  side?: 'left' | 'right';
  children: React.ReactNode;
};

export function Sheet({ open, onClose, side = 'right', children }: SheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className={cn(
          'absolute top-0 h-full w-80 bg-white shadow-lg transition-transform',
          side === 'right' ? 'right-0' : 'left-0',
        )}
      >
        {children}
      </div>
    </div>
  );
}


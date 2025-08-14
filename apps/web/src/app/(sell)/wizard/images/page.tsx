"use client";
import Link from 'next/link';
import { PresignedUploader } from '@/components/uploader/PresignedUploader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { apiPost, apiDelete } from '@/lib/api';

type LocalImage = { id?: string; key: string; orderIndex: number; previewUrl?: string };

export default function ImagesStep() {
  const params = useSearchParams();
  const listingId = params.get('listingId') || '';
  const [images, setImages] = useState<Array<LocalImage>>([]);

  useEffect(() => {
    // Attach images in the order they are uploaded
    async function attachAll() {
      if (!listingId || images.length === 0) return;
      const latest = images[images.length - 1];
      const res = await apiPost<{ image: { id: string } }>(`/api/v1/images/attach`, {
        listingId,
        key: latest.key,
        orderIndex: latest.orderIndex,
      }).catch(() => null);
      if (res?.image?.id) {
        setImages((arr) => arr.map((it, idx) => (idx === arr.length - 1 ? { ...it, id: res.image.id } : it)));
      }
    }
    attachAll();
  }, [listingId, images]);
  return (
    <div className="space-y-4">
      <PresignedUploader onUploaded={(info) => {
        setImages((arr) => [...arr, { key: info.key, orderIndex: arr.length, previewUrl: info.previewUrl }]);
      }} />
      <div className="text-sm text-gray-600">Photos: {images.length}</div>
      <div className="grid grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div
            key={img.id ?? img.key}
            className="rounded border p-1"
            draggable
            onDragStart={(e) => e.dataTransfer.setData('text/plain', String(idx))}
            onDragOver={(e) => e.preventDefault()}
            onDrop={async (e) => {
              const from = Number(e.dataTransfer.getData('text/plain'));
              if (Number.isNaN(from) || from === idx) return;
              const next = [...images];
              const [moved] = next.splice(from, 1);
              next.splice(idx, 0, moved);
              setImages(next.map((n, i) => ({ ...n, orderIndex: i })));
              const payload = next.map((n, i) => ({ id: n.id!, orderIndex: i })).filter((n) => n.id);
              if (payload.length) await apiPost(`/api/v1/images/reorder`, { listingId, order: payload }).catch(() => {});
            }}
          >
            <div className="h-24 w-full rounded bg-gray-100 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.previewUrl ?? undefined} alt="preview" className="h-full w-full object-cover" />
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span>#{idx + 1}</span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border px-1"
                  onClick={async () => {
                    if (!img.id) return;
                    await apiDelete(`/api/v1/images/${img.id}`).catch(() => {});
                    setImages((arr) => arr.filter((x) => x !== img).map((x, i) => ({ ...x, orderIndex: i })));
                  }}
                  type="button"
                >
                  Delete
                </button>
                <span className="text-gray-500">drag to reorder</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-right">
        <Link className="rounded bg-black px-4 py-2 text-white" href={`/(sell)/wizard/review?listingId=${listingId}`}>Next</Link>
      </div>
    </div>
  );
}


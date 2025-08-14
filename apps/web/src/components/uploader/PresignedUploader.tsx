"use client";
import { useState } from "react";
import { apiPost, PresignResponse } from "@/lib/api";

type Props = {
  onUploaded?: (key: string) => void;
  accept?: string;
  maxSizeMb?: number;
};

export function PresignedUploader({ onUploaded, accept = "image/*", maxSizeMb = 10 }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    const file = files[0];
    if (file.size > maxSizeMb * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMb}MB`);
      return;
    }
    setUploading(true);
    try {
      const presign = await apiPost<PresignResponse>("/api/v1/images/presign", {
        mimeType: file.type,
        size: file.size,
      });
      const res = await fetch(presign.uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      onUploaded?.(presign.key);
    } catch (e: any) {
      setError(e?.message ?? "Upload error");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <input
        type="file"
        accept={accept}
        disabled={uploading}
        onChange={(e) => handleFiles(e.target.files)}
      />
      {uploading && <div className="text-sm text-gray-600">Uploading…</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}


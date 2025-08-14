"use client";
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { apiGet, apiPut } from '@/lib/api';

type Profile = { displayName?: string; bio?: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ displayName: '', bio: '' });
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Profile>('/api/v1/me/profile').then(setProfile).catch(() => {});
  }, []);

  async function save() {
    setStatus(null);
    await apiPut('/api/v1/me/profile', profile).catch(() => {});
    setStatus('Saved');
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>
      <div className="space-y-2">
        <label className="text-sm">Display name</label>
        <Input value={profile.displayName ?? ''} onChange={(e) => setProfile({ ...profile, displayName: e.target.value })} />
      </div>
      <div className="space-y-2">
        <label className="text-sm">Bio</label>
        <textarea className="h-24 w-full rounded border border-gray-300 px-3 py-2 text-sm" value={profile.bio ?? ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
      </div>
      <button onClick={save} className="rounded bg-black px-4 py-2 text-white" type="button">Save</button>
      {status && <div className="text-sm text-green-700">{status}</div>}
    </div>
  );
}


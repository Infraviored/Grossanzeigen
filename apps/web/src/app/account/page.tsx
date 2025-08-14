"use client";
import { useEffect, useState } from 'react';
import { apiDelete, apiGet, apiPost } from '@/lib/api';

type Session = { token: string; userAgent?: string; ipAddress?: string; createdAt?: string };
type Me = { email: string; verified?: boolean };

export default function AccountDashboardPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Me>('/api/v1/me').then(setMe).catch(() => {});
    apiGet<Session[]>('/api/v1/me/sessions').then(setSessions).catch(() => {});
  }, []);

  async function revoke(token: string) {
    setBusy(token);
    await apiDelete(`/api/v1/me/sessions/${encodeURIComponent(token)}`).catch(() => {});
    setSessions((prev) => prev.filter((s) => s.token !== token));
    setBusy(null);
  }

  async function resendVerification() {
    await apiPost('/api/v1/auth/verify/resend').catch(() => {});
    alert('Verification email sent if your account is unverified.');
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Account</h1>
        <p className="text-sm text-gray-600">{me?.email}</p>
      </div>

      {me && me.verified === false && (
        <div className="rounded border border-yellow-300 bg-yellow-50 p-4 text-sm">
          <div className="font-medium">Email not verified</div>
          <p className="mt-1">Please verify your email address to unlock full functionality.</p>
          <button onClick={resendVerification} className="mt-3 rounded bg-black px-3 py-1.5 text-white" type="button">Resend verification</button>
        </div>
      )}

      <section>
        <h2 className="text-lg font-semibold">Device sessions</h2>
        <div className="mt-3 divide-y rounded border">
          {sessions.length === 0 ? (
            <div className="p-3 text-sm text-gray-600">No active sessions.</div>
          ) : (
            sessions.map((s) => (
              <div key={s.token} className="flex items-center justify-between p-3 text-sm">
                <div>
                  <div>{s.userAgent || 'Unknown device'}</div>
                  <div className="text-gray-600">{s.ipAddress || '0.0.0.0'} · {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</div>
                </div>
                <button disabled={busy === s.token} onClick={() => revoke(s.token)} className="rounded border px-3 py-1.5 hover:bg-gray-50" type="button">
                  {busy === s.token ? 'Revoking…' : 'Revoke'}
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}



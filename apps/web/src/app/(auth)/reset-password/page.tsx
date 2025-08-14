'use client'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { apiPost } from '@/lib/api';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);
    try {
      await apiPost('/api/v1/auth/reset-password', { email });
      setStatus('If an account exists for this email, a reset link was sent.');
    } catch {
      setStatus('Failed to send reset link');
    }
  }
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">Send reset link</Button>
        {status && <div className="text-sm text-gray-700">{status}</div>}
      </form>
    </div>
  );
}


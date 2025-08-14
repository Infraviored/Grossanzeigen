'use client'
import { useState } from 'react';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  return (
    <div className="mx-auto max-w-sm px-4 py-10">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      <form className="mt-6 space-y-4">
        <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button type="submit">Send reset link</Button>
      </form>
    </div>
  );
}


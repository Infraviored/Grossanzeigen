"use client";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<string>("Submitting token...");

  useEffect(() => {
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    if (!token) {
      setStatus("No token provided.");
      return;
    }
    const run = async () => {
      try {
        const res = await fetch("/api/v1/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (!res.ok) throw new Error("Verification failed");
        setStatus("Email verified. You can close this page.");
      } catch (e: any) {
        setStatus(e.message || "Verification failed");
      }
    };
    run();
  }, []);

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="text-xl font-semibold mb-3">Verify Email</h1>
      <p>{status}</p>
    </main>
  );
}



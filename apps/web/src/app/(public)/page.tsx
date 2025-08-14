export default function PublicHomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Public Home</h1>
      <p className="mt-2 text-sm text-gray-600">Placeholder for marketing/landing.</p>
      <div className="mt-6 flex gap-3">
        <a href="/search" className="underline">Explore listings</a>
      </div>
    </div>
  );
}


export default function FavoritesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Favorites</h1>
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="rounded border p-4 text-sm text-gray-700">No favorites yet.</div>
      </div>
    </div>
  );
}


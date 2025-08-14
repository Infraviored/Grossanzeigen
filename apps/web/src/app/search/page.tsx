"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useListings } from "@/hooks/useListings";

export default function SearchPage() {
	const params = useSearchParams();
	const q = params.get("q") ?? undefined;
	const category = params.get("category") ?? undefined;
	const { data, isLoading } = useListings({ q, category });

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-2xl font-semibold">Search</h1>
			<form action="/search" method="get" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
				<input name="q" defaultValue={q} className="h-10 rounded border border-gray-300 px-3 text-sm" placeholder="Query" />
				<select name="category" defaultValue={category ?? ""} className="h-10 rounded border border-gray-300 px-3 text-sm">
					<option value="">All categories</option>
					<option value="electronics">Electronics</option>
				</select>
				<button className="h-10 rounded bg-black px-4 text-sm text-white" type="submit">Search</button>
			</form>

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{isLoading ? (
					[...Array(6)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded bg-gray-100" />)
				) : (
					(data?.items ?? []).map((item: any) => (
						<Link key={item.id} href={`/listings/${item.id}`} className="rounded border p-3 text-sm">
							<div className="h-32 w-full rounded bg-gray-100" />
							<div className="mt-2 font-medium">{item.title}</div>
							<div className="text-gray-600">{(item.price / 100).toFixed(2)} {item.currency}</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}


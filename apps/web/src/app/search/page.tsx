"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useListings } from "@/hooks/useListings";
import { useCategories } from "@/hooks/useCategories";
import { ResultCard } from "@/components/ResultCard";
import { useEffect, useMemo, useRef, useState } from "react";

export default function SearchPage() {
	const params = useSearchParams();
	const router = useRouter();
	const q = params.get("q") ?? undefined;
	const categoryId = params.get("categoryId") ?? undefined;
	const min = params.get("min") ?? undefined;
	const max = params.get("max") ?? undefined;
	const sort = params.get("sort") ?? undefined;
	const cursor = params.get("cursor");
	const stackParam = params.get("stack");
	let stack: (string | null)[] = [];
	try {
		stack = stackParam ? (JSON.parse(decodeURIComponent(stackParam)) as (string | null)[]) : [];
	} catch {}
	const { data, isLoading } = useListings({ q, categoryId, min, max, sort, cursor });
	const { data: cats } = useCategories();

	// Debounced URL updates for query input
	const [queryInput, setQueryInput] = useState(q ?? "");
	const debounceRef = useRef<number | null>(null);
	useEffect(() => setQueryInput(q ?? ""), [q]);
	const updateUrl = (next: Record<string, string | undefined>) => {
		const u = new URLSearchParams(params.toString());
		Object.entries(next).forEach(([key, value]) => {
			if (value == null || value === "") u.delete(key);
			else u.set(key, value);
		});
		u.delete('cursor');
		u.delete('stack');
		router.replace(`/search?${u.toString()}`);
	};

	const onQueryChange = (value: string) => {
		setQueryInput(value);
		if (debounceRef.current) window.clearTimeout(debounceRef.current);
		debounceRef.current = window.setTimeout(() => {
			updateUrl({ q: value || undefined });
		}, 400);
	};

	const selectedCategoryName = useMemo(() => {
		if (!categoryId) return undefined;
		const list = cats?.categories ?? [];
		return list.find(c => c.id === categoryId)?.name;
	}, [categoryId, cats]);

	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<h1 className="text-2xl font-semibold">Search</h1>
			<form action="/search" method="get" className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-6">
				<input name="q" value={queryInput} onChange={(e) => onQueryChange(e.target.value)} className="h-10 rounded border border-gray-300 px-3 text-sm" placeholder="Search items" />
				<select
					name="categoryId"
					value={categoryId ?? ""}
					onChange={(e) => updateUrl({ categoryId: e.target.value || undefined })}
					className="h-10 rounded border border-gray-300 px-3 text-sm"
				>
					<option value="">All categories</option>
					{(cats?.categories ?? []).map((c) => (
						<option key={c.id} value={c.id}>{c.name}</option>
					))}
				</select>
				<input name="min" value={min ?? ""} onChange={(e) => updateUrl({ min: e.target.value || undefined })} className="h-10 rounded border border-gray-300 px-3 text-sm" placeholder="Min price" />
				<input name="max" value={max ?? ""} onChange={(e) => updateUrl({ max: e.target.value || undefined })} className="h-10 rounded border border-gray-300 px-3 text-sm" placeholder="Max price" />
				<select name="sort" value={sort ?? ""} onChange={(e) => updateUrl({ sort: e.target.value || undefined })} className="h-10 rounded border border-gray-300 px-3 text-sm">
					<option value="">Sort by</option>
					<option value="date_desc">Newest</option>
					<option value="price_asc">Price: Low to High</option>
					<option value="price_desc">Price: High to Low</option>
				</select>
				<button className="h-10 rounded bg-black px-4 text-sm text-white" type="submit">Search</button>
			</form>

			{categoryId ? (
				<div className="mt-3 flex items-center gap-2 text-sm">
					<span className="rounded-full bg-gray-100 px-3 py-1">Category: {selectedCategoryName ?? categoryId}</span>
					<button
						onClick={() => updateUrl({ categoryId: undefined })}
						className="rounded border px-2 py-1"
					>
						Clear
					</button>
				</div>
			) : null}

			<div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
				{isLoading ? (
					[...Array(6)].map((_, i) => <div key={i} className="h-32 animate-pulse rounded bg-gray-100" />)
				) : (
					(data?.listings ?? []).length === 0 ? (
						<div className="text-sm text-gray-600">No results. Try adjusting your search.</div>
					) : (
						(useMemo(() => {
							const list = [...(data?.listings ?? [])];
							if (sort === 'price_asc') list.sort((a: any, b: any) => a.price - b.price);
							else if (sort === 'price_desc') list.sort((a: any, b: any) => b.price - a.price);
							// default date_desc is what backend returns
							return list;
						}, [data?.listings, sort]) as any[]).map((item: any) => {
						const first = (item.images ?? [])[0];
						const variants = first?.variants ?? {};
						const thumb = variants.thumb || variants.medium || null;
						return (
							<ResultCard
								key={item.id}
								id={item.id}
								title={item.title}
								price={item.price}
								currency={item.currency}
								imageUrl={thumb}
								locationText={item.locationText}
							/>
						);
					})
					)
				)}
			</div>

			<div className="mt-6 flex items-center justify-between">
				{stack.length > 0 ? (
					<Link
						href={`/search?${new URLSearchParams({
							...(q ? { q } : {}),
							...(categoryId ? { categoryId } : {}),
							...(min ? { min } : {}),
							...(max ? { max } : {}),
							...(sort ? { sort } : {}),
							...(stack[stack.length - 1] ? { cursor: stack[stack.length - 1] as string } : {}),
							stack: encodeURIComponent(JSON.stringify(stack.slice(0, -1))),
						}).toString()}`}
						className="rounded border px-3 py-2 text-sm"
					>
						← Previous
					</Link>
				) : <span />}
				{data?.nextCursor ? (
					<Link
						href={`/search?${new URLSearchParams({
							...(q ? { q } : {}),
							...(categoryId ? { categoryId } : {}),
							...(min ? { min } : {}),
							...(max ? { max } : {}),
							...(sort ? { sort } : {}),
							cursor: data.nextCursor,
							stack: encodeURIComponent(JSON.stringify([...(stack ?? []), cursor ?? null])),
						}).toString()}`}
						className="rounded border px-3 py-2 text-sm"
					>
						Next →
					</Link>
				) : <span />}
			</div>
		</div>
	);
}


"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	return (
		<html>
			<body>
				<div className="mx-auto max-w-2xl px-4 py-10">
					<h1 className="text-2xl font-semibold">Something went wrong</h1>
					<p className="mt-2 text-sm text-gray-600">{error.message}</p>
					<button className="mt-4 rounded bg-black px-4 py-2 text-white" onClick={reset}>Try again</button>
				</div>
			</body>
		</html>
	)
}


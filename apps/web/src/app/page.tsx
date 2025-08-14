import Link from "next/link";

export default function HomePage() {
	return (
		<div className="mx-auto max-w-6xl px-4 py-10">
			<section className="grid gap-8 md:grid-cols-2 md:items-center">
				<div>
					<h1 className="text-3xl font-semibold">Buy and sell locally with confidence</h1>
					<p className="mt-3 text-gray-600">Search millions of listings or post your own in minutes.</p>
					<form action="/search" method="get" className="mt-6 flex gap-2">
						<input name="q" className="h-10 w-full rounded border border-gray-300 px-3 text-sm" placeholder="Search for anything" />
						<button type="submit" className="h-10 rounded bg-black px-4 text-sm text-white">Search</button>
					</form>
					<div className="mt-4 flex gap-3">
						<Link href="/sell" className="rounded bg-black px-4 py-2 text-white">Start selling</Link>
						<Link href="/search" className="rounded border px-4 py-2">Browse</Link>
					</div>
				</div>
				<div className="aspect-video w-full rounded bg-gray-100" />
			</section>
			<section className="mt-12">
				<h2 className="text-xl font-semibold">Popular categories</h2>
				<div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
					<Link href="/search?category=electronics" className="rounded border p-4 text-center">Electronics</Link>
					<Link href="/search?category=home" className="rounded border p-4 text-center">Home</Link>
					<Link href="/search?category=fashion" className="rounded border p-4 text-center">Fashion</Link>
					<Link href="/search?category=motors" className="rounded border p-4 text-center">Motors</Link>
				</div>
			</section>
		</div>
	);
}
import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

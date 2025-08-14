export default function SellWizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Create listing</h1>
      <div className="mt-6">{children}</div>
    </div>
  );
}


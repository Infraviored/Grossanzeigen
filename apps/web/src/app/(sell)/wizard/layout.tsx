export default function SellWizardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Create listing</h1>
      <p className="mt-1 text-sm text-gray-600">Your progress is autosaved. You can return anytime from the Sell page.</p>
      <div className="mt-4">
        {/* Progress */}
        {/* @ts-expect-error server boundary not needed */}
        {require('@/components/sell/WizardProgress').WizardProgress()}
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}


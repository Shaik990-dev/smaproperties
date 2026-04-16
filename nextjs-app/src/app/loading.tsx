export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-cream)]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[var(--color-navy)] border-t-[var(--color-amber)] rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-sm text-gray-500 font-medium">Loading...</p>
      </div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="font-display text-2xl font-bold text-gray-900 mb-3">{title}</h2>
      <div className="text-gray-700 leading-relaxed space-y-3 [&_a]:text-[var(--color-navy)] [&_a]:underline [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-1.5 [&_li]:text-gray-700">
        {children}
      </div>
    </section>
  );
}

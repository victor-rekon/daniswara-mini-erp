type PlaceholderPanelProps = {
  title: string;
  description: string;
  items?: string[];
};

export function PlaceholderPanel({ title, description, items = [] }: PlaceholderPanelProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item} className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4 text-sm text-slate-300">
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}

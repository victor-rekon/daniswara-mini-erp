export default function Loading() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f6f7fa]">
      <div className="md:pl-60">
        {/* Header skeleton - navy band stays so brand never flashes away */}
        <div className="bg-[#1a2456] px-4 pb-4 pt-4 md:px-8 md:pb-5">
          <div className="h-3 w-44 animate-pulse rounded bg-white/15" />
          <div className="mt-2 h-6 w-56 animate-pulse rounded bg-white/20" />
          <div className="mt-3.5 flex gap-1.5 md:hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </div>
        {/* Card skeletons */}
        <div className="p-3 md:p-6">
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="h-[88px] animate-pulse rounded-[14px] border border-[#e6e8ef] bg-white"
              />
            ))}
          </div>
          <div className="mt-3 h-40 animate-pulse rounded-2xl border border-[#e6e8ef] bg-white" />
        </div>
      </div>
    </div>
  );
}

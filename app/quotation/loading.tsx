function BrandMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9.5 21c-3.3 0-6-2.6-6-5.9 0-2.6 1.7-4.8 3.4-6.9.9 1.6 2.3 2.4 2.3 2.4S8 7.2 9.9 4.5C11 3 12.4 2 12.4 2s-.5 2.6.7 4.6c-2.5 2.8-3.9 5-3.9 7.8 0 2.7 1.5 5 3.7 6.2-1 .3-2.2.4-3.4.4z"
        fill="#2b6cb8"
      />
      <path
        d="M14.2 21.4c2.7-1.1 4.3-3.4 4.3-6.2 0-3.4-2.5-5.6-4.4-8.4-1.4-2-1.1-4.8-1.1-4.8s2.9 1.5 4.8 4.3c1.9 2.7 3.2 5.2 3.2 8.2 0 3.8-2.9 6.9-6.8 6.9z"
        fill="#c99a2e"
      />
    </svg>
  );
}

export default function Loading() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent">
      <div className="md:pl-60">
        {/* Navy header band with gold progress shimmer */}
        <div className="relative overflow-hidden bg-[#1a2456] px-4 pb-4 pt-4 md:px-8 md:pb-5">
          <div className="absolute inset-x-0 top-0 h-[2.5px] overflow-hidden">
            <div className="h-full w-1/3 animate-[shimmer_1s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-[#d9b25c] to-transparent" />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 animate-pulse items-center justify-center rounded-lg bg-white shadow-sm">
              <BrandMark size={22} />
            </div>
            <div>
              <div className="h-2.5 w-44 animate-pulse rounded bg-white/15" />
              <div className="mt-2 h-5 w-40 animate-pulse rounded bg-white/25" />
            </div>
          </div>
          <div className="mt-3.5 flex gap-1.5 md:hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </div>
        {/* Card skeletons */}
        <div className="p-3 md:p-6">
          <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3 xl:grid-cols-7">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="relative h-[78px] animate-pulse overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#12151f]"
              >
                <div className="absolute inset-x-0 top-0 h-[2.5px] bg-[rgba(255,255,255,0.08)]" />
                <div className="px-3.5 pt-3.5">
                  <div className="h-2 w-16 rounded bg-[rgba(255,255,255,0.06)]" />
                  <div className="mt-2.5 h-4 w-12 rounded bg-[rgba(255,255,255,0.08)]" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:gap-4 xl:grid-cols-[420px_minmax(0,1fr)]">
            <div className="h-72 animate-pulse rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f]" />
            <div className="h-72 animate-pulse rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f]" />
          </div>
        </div>
      </div>
      <style>{`@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }`}</style>
    </div>
  );
}

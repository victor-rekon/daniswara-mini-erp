"use client";

import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

type CollapsibleRecordsProps = {
  title: string;
  count?: number;
  children: ReactNode;
};

/* Mobile: collapsed behind a toggle button to keep summary+form on one screen.
   Desktop (lg+): always expanded, no toggle. */
export function CollapsibleRecords({ title, count, children }: CollapsibleRecordsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] px-4 py-3.5 shadow-card active:scale-[0.99] lg:hidden"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#e2e8f0]">{title}</span>
          {typeof count === "number" && (
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-[11px] font-bold text-[#64748b]">
              {count}
            </span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-[#94a3b8] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {/* Mobile: collapsible body. Desktop: always shown. */}
      <div className={`${open ? "block" : "hidden"} lg:block`}>{children}</div>
    </>
  );
}

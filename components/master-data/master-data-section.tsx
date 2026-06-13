import type { ReactNode } from "react";

type MasterDataSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function MasterDataSection({ title, description, children }: MasterDataSectionProps) {
  return (
    <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-4 shadow-card md:p-5">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[#e2e8f0]">{title}</h3>
        <p className="mt-0.5 text-xs text-[#94a3b8]">{description}</p>
      </div>
      {children}
    </section>
  );
}

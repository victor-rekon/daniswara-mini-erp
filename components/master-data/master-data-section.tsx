import type { ReactNode } from "react";

type MasterDataSectionProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function MasterDataSection({ title, description, children }: MasterDataSectionProps) {
  return (
    <section className="rounded-2xl border border-[#e6e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(26,36,86,0.05)] md:p-5">
      <div className="mb-3">
        <h3 className="text-base font-semibold text-[#233575]">{title}</h3>
        <p className="mt-0.5 text-xs text-[#7a829b]">{description}</p>
      </div>
      {children}
    </section>
  );
}

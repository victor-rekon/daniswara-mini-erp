"use client";

import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/navigation";

const mainNav = navigationItems.filter((i) => i.href !== "/settings");
const settingsNav = navigationItems.find((i) => i.href === "/settings");

/* Daniswara flame-drop mark (navy + gold, from company logo) */
function BrandMark({ size = 20 }: { size?: number }) {
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

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-gradient-to-b from-[#1f2c63] via-[#1a2456] to-[#161f47] md:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-card ring-1 ring-white/10">
          <BrandMark size={22} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-white">Daniswara ERP</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#d9b25c]">
            SistemBeres
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#64748b]">
          Modules
        </p>
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 active:bg-white/15 ${
                isActive
                  ? "bg-gradient-to-r from-[#d9b25c]/15 via-white/10 to-transparent text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                  : "text-[#9aa3c0] hover:bg-white/5 hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 inset-y-[7px] w-[3px] rounded-r-full bg-[#d9b25c]" />
              )}
              <Icon
                className={`h-4 w-4 shrink-0 ${isActive ? "text-[#d9b25c]" : ""}`}
                aria-hidden="true"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-2 pb-4 pt-3">
        {settingsNav && (
          <Link
            href={settingsNav.href}
            className={`relative mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 active:bg-white/15 ${
              pathname === settingsNav.href
                ? "bg-white/10 text-white"
                : "text-[#9aa3c0] hover:bg-white/5 hover:text-white"
            }`}
          >
            {pathname === settingsNav.href && (
              <span className="absolute left-0 inset-y-[7px] w-[3px] rounded-r-full bg-[#d9b25c]" />
            )}
            <settingsNav.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
        )}
        <div className="rounded-lg bg-white/5 px-3 py-2.5">
          <p className="text-[10px] font-semibold text-[#9aa3c0]">
            PT Daniswara Gas Indonesia
          </p>
          <p className="mt-0.5 text-[10px] text-[#64748b]">
            Phase 1 &middot; Operations
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const activeRef = useRef<HTMLAnchorElement>(null);

  // Center the active pill on mount / route change so the user never has to
  // re-scroll the command bar after navigating.
  useEffect(() => {
    const el = activeRef.current;
    if (el) {
      el.scrollIntoView({ inline: "center", block: "nearest" });
    }
  }, [pathname]);

  return (
    <nav
      className="mt-3.5 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            ref={isActive ? activeRef : undefined}
            href={item.href}
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-150 active:scale-95 ${
              isActive
                ? "bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] text-[#1a2456] shadow-[0_2px_8px_-2px_rgba(217,178,92,0.6)]"
                : "bg-white/8 text-[#b9c0d8] active:bg-white/15"
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

type AppShellProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function AppShell({ title, description, children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <Sidebar />
      <main className="md:pl-60">
        {/* Navy header band - brand identity */}
        <header className="relative z-10 bg-gradient-to-br from-[#1f2c63] via-[#1a2456] to-[#161f47] px-4 pb-4 pt-4 shadow-navy md:rounded-none md:px-8 md:pb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-card ring-1 ring-white/10 md:hidden">
                <BrandMark size={22} />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#d9b25c]">
                  PT Daniswara Gas Indonesia
                </p>
                <h2 className="mt-0.5 text-xl font-bold leading-tight tracking-tight text-white">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-0.5 hidden text-xs text-[#9aa3c0] md:block">
                    {description}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="shrink-0 rounded-full bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-3.5 py-1 text-xs font-bold text-[#1a2456] shadow-[0_2px_8px_-2px_rgba(217,178,92,0.6)] ring-1 ring-[#fff]/30">
              Phase 1
            </div>
          </div>
          <MobileNav />
        </header>

        <div className="min-w-0 overflow-x-hidden p-2.5 md:p-6">{children}</div>
      </main>
    </div>
  );
}

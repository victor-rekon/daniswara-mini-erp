"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/navigation";
import { ROLE_COOKIE_NAME, canAccessHref, normalizeRole, type UserRole } from "@/lib/access/roles";

const mainNav = navigationItems.filter((i) => i.href !== "/settings");
const settingsNav = navigationItems.find((i) => i.href === "/settings");

function getCookieValue(name: string) {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : null;
}

function useClientRole() {
  const [role, setRole] = useState<UserRole>("owner");

  useEffect(() => {
    setRole(normalizeRole(getCookieValue(ROLE_COOKIE_NAME)));
  }, []);

  return role;
}

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
  const role = useClientRole();
  const visibleMainNav = mainNav.filter((item) => canAccessHref(role, item.href));
  const canSeeSettings = settingsNav ? canAccessHref(role, settingsNav.href) : false;

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-gradient-to-b from-[#141b42] via-[#0f1530] to-[#0a0e22] shadow-[inset_-1px_0_0_rgba(255,255,255,0.05)] md:flex">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-[18px]">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-card ring-1 ring-white/10">
          <BrandMark size={22} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold tracking-tight text-white">Daniswara ERP</p>
          <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-[#d9b25c]">
            SistemBeres
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#5d6788]">
          Modules
        </p>
        {visibleMainNav.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 active:bg-white/[0.12] ${
                isActive
                  ? "bg-gradient-to-r from-[#d9b25c]/[0.14] to-transparent text-white"
                  : "text-[#97a0bb] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 inset-y-1.5 w-[2.5px] rounded-r-full bg-gradient-to-b from-[#e8c878] to-[#c99a2e]" />
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
        {settingsNav && canSeeSettings && (
          <Link
            href={settingsNav.href}
            className={`relative mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 active:bg-white/15 ${
              pathname === settingsNav.href
                ? "bg-white/10 text-white"
                : "text-[#9aa3c0] hover:bg-white/5 hover:text-white"
            }`}
          >
            {pathname === settingsNav.href && (
              <span className="absolute left-0 inset-y-1.5 w-[2.5px] rounded-r-full bg-gradient-to-b from-[#e8c878] to-[#c99a2e]" />
            )}
            <settingsNav.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
        )}
        <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-3">
          <p className="text-[10px] font-medium text-[#97a0bb]">
            PT Daniswara Gas Indonesia
          </p>
          <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-[#5d6788]">
            {role.toUpperCase()} &middot; Phase 1
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  const role = useClientRole();
  const activeRef = useRef<HTMLAnchorElement>(null);
  const visibleItems = navigationItems.filter((item) => canAccessHref(role, item.href));

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
      className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {visibleItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            ref={isActive ? activeRef : undefined}
            href={item.href}
            className={`flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
              isActive
                ? "bg-gradient-to-br from-[#e8c878] to-[#c99a2e] font-semibold text-[#141b42] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.55)]"
                : "border border-white/[0.07] bg-white/[0.04] text-[#aeb6cf] active:bg-white/[0.1]"
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

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent text-slate-100">
      <Sidebar />
      <main className="md:pl-60">
        <header className="relative z-10 border-b border-white/[0.06] bg-gradient-to-br from-[#141b42] via-[#0f1530] to-[#0a0e22] px-4 py-3 shadow-navy md:px-8 md:py-3.5">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white shadow-card ring-1 ring-white/10 md:hidden">
                <BrandMark size={20} />
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold leading-tight tracking-tight text-white md:text-lg">
                  {title}
                </h2>
                <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-[#d9b25c] md:hidden">
                  PT Daniswara Gas Indonesia
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#d9b25c]/25 bg-[#d9b25c]/[0.07] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#e8c878] md:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e8c878] shadow-[0_0_6px_rgba(232,200,120,0.8)]" />
              Phase 1
            </div>
          </div>
          <MobileNav />
        </header>

        <div className="min-w-0 overflow-x-hidden p-3 md:p-7 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

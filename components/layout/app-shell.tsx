"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationItems } from "@/lib/constants/navigation";

const mainNav = navigationItems.filter((i) => i.href !== "/settings");
const settingsNav = navigationItems.find((i) => i.href === "/settings");

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-slate-900 md:flex">
      <div className="flex items-center gap-3 border-b border-slate-800 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg">
          <span className="text-sm font-bold text-white">D</span>
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-indigo-400">
            SistemBeres
          </p>
          <p className="truncate text-sm font-semibold text-white">
            Daniswara ERP
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-600">
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
              className={`relative mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
              }`}
            >
              {isActive && (
                <span className="absolute left-0 inset-y-[6px] w-[3px] rounded-r-full bg-indigo-400" />
              )}
              <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 px-2 pb-4 pt-3">
        {settingsNav && (
          <Link
            href={settingsNav.href}
            className={`relative mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
              pathname === settingsNav.href
                ? "bg-white/10 text-white"
                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
            }`}
          >
            {pathname === settingsNav.href && (
              <span className="absolute left-0 inset-y-[6px] w-[3px] rounded-r-full bg-indigo-400" />
            )}
            <settingsNav.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            Settings
          </Link>
        )}
        <div className="rounded-lg bg-slate-800/60 px-3 py-2.5">
          <p className="text-[10px] font-semibold text-slate-400">
            PT Daniswara Gas Indonesia
          </p>
          <p className="mt-0.5 text-[10px] text-slate-600">
            Phase 1 &middot; Operations
          </p>
        </div>
      </div>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-0.5 md:hidden">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-slate-500 shadow-sm ring-1 ring-slate-200 hover:text-indigo-600"
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
    <div className="min-h-screen bg-[#e8edf4] text-slate-950">
      <Sidebar />
      <main className="md:pl-60">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 shadow-sm backdrop-blur-sm md:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-500">
                PT Daniswara Gas Indonesia
              </p>
              <h2 className="mt-0.5 text-xl font-black tracking-tight text-slate-900">
                {title}
              </h2>
              {description ? (
                <p className="mt-0.5 text-xs text-slate-400">{description}</p>
              ) : null}
            </div>
            <div className="hidden shrink-0 rounded-full bg-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-sm md:block">
              Phase 1
            </div>
          </div>
          <MobileNav />
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}

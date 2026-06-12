# DESIGN SYSTEM & PERFORMANCE BENCHMARK (LOCKED)

Benchmark commit: 16bacdd (2026-06-12). All future changes MUST preserve the rules below.
Do NOT revert, restyle, or "optimize" against these rules without explicit owner approval.

## 1. Brand tokens (from Daniswara Gas Indonesia logo)
- Navy 900 `#1a2456` (sidebar, header band, primary text)
- Navy 700 `#233575` / Navy 500 `#2f4a9e` (values, accents)
- Logo blue `#2b6cb8` (brand mark only)
- Gold 500 `#b8860b` / Gold 400 `#c99a2e` / Gold 300 `#d9b25c` (accents, active states, revenue values)
- Green `#15803d` (profit/received), Red `#b91c1c` (outstanding/overdue), Amber `#d97706`/`#b45309` (losses/pending)
- Background `#f6f7fa`, border `#e6e8ef`, muted text `#7a829b`, faint text `#a4aabe`
- Font: Lexend (var --font-lexend) via next/font/google. Never Arial/system-only.

## 2. Component rules
- Sidebar + header band: navy `#1a2456`, gold active indicator `#d9b25c`, white logo tile with the SVG flame-drop mark.
- Metric cards: white, `rounded-[14px]`, border `#e6e8ef`, top stripe `h-[2.5px]` color-coded by meaning
  (navy operational, gold gradient revenue, green received/profit, red risk, amber warning).
- Hover: `-translate-y-0.5 hover:shadow-md`; tap: `active:scale-[0.98]`; transitions 150ms.
- Section titles: `text-[11px] font-bold uppercase tracking-[0.14em] text-[#233575]` with one gold word.
- Mobile nav: gold gradient pill for active item, `overflow-x-auto`, hidden scrollbar.
- Page grids: `grid gap-3 md:gap-4`. Summary card rows: `grid-cols-2 md:grid-cols-4` (xl:grid-cols-7 where 7 cards).
- Sales & Delivery: form|table split on xl: `xl:grid-cols-[420px_minmax(0,1fr)]`.

## 3. Performance rules (CRITICAL - do not regress)
- NEVER use `export const dynamic = "force-dynamic"`. Use `export const revalidate = 30` (ISR).
- ALL Supabase queries in a page MUST run in a single `Promise.all([...])`. Never sequential awaits.
- Every route MUST keep its `loading.tsx` (branded skeleton: navy band, gold shimmer bar, pulse cards).
- Server actions MUST call `revalidatePath()` for their page + `/dashboard` after mutations.
- Keep in globals.css: `-webkit-tap-highlight-color: transparent`, `touch-action: manipulation`,
  `prefers-reduced-motion` block.
- Root layout: `overflow-x-hidden` on shell root, `min-w-0 overflow-x-auto` on content area.

## 4. Verification before pushing
- TSX must parse cleanly (no smart quotes / unicode dashes in code).
- After deploy, confirm response header `x-vercel-cache: PRERENDER` or `HIT` on module pages.

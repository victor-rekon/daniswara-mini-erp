import { submitAccess } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next || "/dashboard";
  const hasError = params?.error === "1";

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-6 shadow-card">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c878]">Secure Login</p>
          <h1 className="text-lg font-bold tracking-tight text-[#e2e8f0]">Daniswara Mini ERP</h1>
          <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">
            Masuk dengan User ID masing-masing. Role dan akses modul ditentukan otomatis oleh sistem.
          </p>
        </div>

        <form action={submitAccess} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="username" className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              User ID
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoCapitalize="none"
              autoComplete="username"
              className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#d9b25c]"
              placeholder="contoh: owner"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#d9b25c]"
              required
            />
            {hasError ? <p className="mt-2 text-xs font-semibold text-red-400">User ID atau password salah.</p> : null}
          </div>

          <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)]">
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

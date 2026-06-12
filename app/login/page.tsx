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
    <main className="flex min-h-screen items-center justify-center bg-[#f6f7fa] px-4 py-10 text-[#1a2456]">
      <section className="w-full max-w-md rounded-2xl border border-[#e6e8ef] bg-white p-6 shadow-[0_12px_30px_rgba(26,36,86,0.08)]">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#b8860b]">Internal</p>
          <h1 className="text-lg font-bold tracking-tight text-[#233575]">Daniswara Mini ERP</h1>
          <p className="mt-1 text-xs text-[#7a829b]">Enter the internal code to continue.</p>
        </div>

        <form action={submitAccess} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="access_code" className="text-xs font-bold uppercase tracking-[0.12em] text-[#7a829b]">
              Internal Code
            </label>
            <input
              id="access_code"
              name="access_code"
              type="password"
              className="mt-2 w-full rounded-xl border border-[#e6e8ef] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#d9b25c]"
              required
            />
            {hasError ? <p className="mt-2 text-xs font-semibold text-red-700">Incorrect code.</p> : null}
          </div>

          <button type="submit" className="rounded-xl bg-[#d9b25c] px-4 py-2.5 text-sm font-bold text-[#1a2456]">
            Enter System
          </button>
        </form>
      </section>
    </main>
  );
}

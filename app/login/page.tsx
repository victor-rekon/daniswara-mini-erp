import { submitAccess } from "./actions";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/access/roles";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

type LoginUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = params?.next || "/dashboard";
  const hasError = params?.error === "1";
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("app_users")
    .select("id, name, email, role")
    .eq("is_active", true)
    .order("created_at", { ascending: true });
  const users = (data ?? []) as LoginUser[];

  return (
    <main className="flex min-h-screen items-center justify-center bg-transparent px-4 py-10 text-slate-100">
      <section className="w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-6 shadow-card">
        <div className="mb-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c878]">Internal</p>
          <h1 className="text-lg font-bold tracking-tight text-[#e2e8f0]">Daniswara Mini ERP</h1>
          <p className="mt-1 text-xs text-[#94a3b8]">Enter the internal code and choose the test user.</p>
        </div>

        <form action={submitAccess} className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <div>
            <label htmlFor="access_code" className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              Internal Code
            </label>
            <input
              id="access_code"
              name="access_code"
              type="password"
              className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#d9b25c]"
              required
            />
            {hasError ? <p className="mt-2 text-xs font-semibold text-red-400">Incorrect code.</p> : null}
          </div>

          <div>
            <label htmlFor="user_id" className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              Registered User
            </label>
            <select
              id="user_id"
              name="user_id"
              className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#d9b25c]"
            >
              {users.map((user) => (
                <option key={user.id} value={user.id} className="bg-[#12151f] text-slate-100">
                  {user.name} — {ROLE_LABELS[user.role]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="role" className="text-xs font-bold uppercase tracking-[0.12em] text-[#94a3b8]">
              Fallback Role
            </label>
            <select
              id="role"
              name="role"
              defaultValue="owner"
              className="mt-2 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-[#d9b25c]"
            >
              {USER_ROLES.map((role) => (
                <option key={role} value={role} className="bg-[#12151f] text-slate-100">
                  {ROLE_LABELS[role]}
                </option>
              ))}
            </select>
            <p className="mt-2 text-[11px] leading-relaxed text-[#94a3b8]">
              The selected registered user controls the active role. Fallback role is used only if no user is selected.
            </p>
          </div>

          <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)]">
            Enter System
          </button>
        </form>
      </section>
    </main>
  );
}

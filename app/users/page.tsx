import { AppShell } from "@/components/layout/app-shell";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { ROLE_LABELS, USER_ROLES, type UserRole } from "@/lib/access/roles";
import { createAppUser, setAppUserStatus } from "./actions";

export const dynamic = "force-dynamic";

type AppUser = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  last_login_at: string | null;
  require_password_update: boolean | null;
};

function roleBadge(role: UserRole) {
  if (role === "owner") return "border-[#d9b25c]/25 bg-[#d9b25c]/[0.10] text-[#e8c878]";
  if (role === "admin") return "border-blue-400/25 bg-blue-400/[0.08] text-blue-300";
  if (role === "finance") return "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300";
  return "border-slate-400/25 bg-slate-400/[0.08] text-slate-300";
}

function fmtDate(value: string | null) {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

const inputClass = "mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-[#d9b25c]";
const labelClass = "text-[10px] font-bold uppercase tracking-[0.14em] text-[#94a3b8]";

export default async function UsersPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("app_users")
    .select("id, name, email, username, role, is_active, created_at, last_login_at, require_password_update")
    .order("created_at", { ascending: true });

  const users = (data ?? []) as AppUser[];
  const activeCount = users.filter((user) => user.is_active).length;

  return (
    <AppShell title="Employee Data Center" description="Owner-controlled user and role management.">
      <div className="grid gap-4 md:gap-5">
        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Owner Control</p>
          <h1 className="mt-1 text-xl font-bold text-[#e2e8f0]">Employee Data Center</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            Owner/Admin dapat mendaftarkan Admin, Finance, dan Staff. Role menentukan dashboard dan menu yang muncul setelah login.
          </p>
          <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Total Users</p>
              <p className="mt-1 text-lg font-bold text-[#e8c878]">{users.length}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Active</p>
              <p className="mt-1 text-lg font-bold text-emerald-300">{activeCount}</p>
            </div>
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">Inactive</p>
              <p className="mt-1 text-lg font-bold text-red-300">{users.length - activeCount}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <h2 className="text-sm font-bold text-[#e2e8f0]">Register Employee Login</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">Buat User ID baru untuk admin, finance, atau staff. Simpan access key sementara dan berikan langsung ke user terkait.</p>
          <form action={createAppUser} className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            <div className="xl:col-span-1">
              <label className={labelClass} htmlFor="name">Employee Name</label>
              <input id="name" name="name" required className={inputClass} placeholder="Nama user" />
            </div>
            <div className="xl:col-span-1">
              <label className={labelClass} htmlFor="username">User ID</label>
              <input id="username" name="username" required className={inputClass} placeholder="contoh: finance01" autoCapitalize="none" />
            </div>
            <div className="xl:col-span-1">
              <label className={labelClass} htmlFor="email">Email</label>
              <input id="email" name="email" type="email" required className={inputClass} placeholder="user@company.com" />
            </div>
            <div className="xl:col-span-1">
              <label className={labelClass} htmlFor="role">Role</label>
              <select id="role" name="role" className={inputClass} defaultValue="staff">
                {USER_ROLES.filter((role) => role !== "owner").map((role) => (
                  <option key={role} value={role} className="bg-[#12151f] text-slate-100">{ROLE_LABELS[role]}</option>
                ))}
              </select>
            </div>
            <div className="xl:col-span-1">
              <label className={labelClass} htmlFor="access_key">Access Key</label>
              <input id="access_key" name="access_key" required className={inputClass} placeholder="temporary key" />
            </div>
            <button className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] md:col-span-2 xl:col-span-5">
              Register Employee
            </button>
          </form>
        </section>

        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#e2e8f0]">Employee Users</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">{users.length} user(s) configured.</p>
            </div>
          </div>

          <div className="mt-4 grid gap-2.5 md:hidden">
            {users.map((user) => (
              <div key={user.id} className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-bold text-[#e2e8f0]">{user.name}</p>
                    <p className="mt-1 break-words text-xs text-[#94a3b8]">@{user.username ?? "no-id"} · {user.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-bold ${roleBadge(user.role)}`}>{ROLE_LABELS[user.role]}</span>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-[#94a3b8]">
                  <p>Status: <span className={user.is_active ? "font-bold text-emerald-300" : "font-bold text-red-300"}>{user.is_active ? "Active" : "Inactive"}</span></p>
                  <p>Last login: {fmtDate(user.last_login_at)}</p>
                </div>
                <form action={setAppUserStatus} className="mt-3">
                  <input type="hidden" name="id" value={user.id} />
                  <input type="hidden" name="next_status" value={String(!user.is_active)} />
                  <button className="w-full rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-[#cbd5e1] hover:border-[#d9b25c]/40 hover:text-[#e8c878]">
                    {user.is_active ? "Deactivate" : "Activate"}
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="mt-4 hidden overflow-x-auto rounded-xl border border-white/[0.07] md:block">
            <table className="min-w-full divide-y divide-white/[0.07] text-sm">
              <thead className="bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.14em] text-[#94a3b8]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Last Login</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {users.map((user) => (
                  <tr key={user.id} className="text-[#e2e8f0]">
                    <td className="px-4 py-3 font-semibold">{user.name}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">@{user.username ?? "no-id"}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">{user.email}</td>
                    <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${roleBadge(user.role)}`}>{ROLE_LABELS[user.role]}</span></td>
                    <td className="px-4 py-3 text-[#94a3b8]">{fmtDate(user.last_login_at)}</td>
                    <td className="px-4 py-3"><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${user.is_active ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300" : "border-red-400/25 bg-red-400/[0.08] text-red-300"}`}>{user.is_active ? "Active" : "Inactive"}</span></td>
                    <td className="px-4 py-3 text-right">
                      <form action={setAppUserStatus}>
                        <input type="hidden" name="id" value={user.id} />
                        <input type="hidden" name="next_status" value={String(!user.is_active)} />
                        <button className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs font-semibold text-[#cbd5e1] hover:border-[#d9b25c]/40 hover:text-[#e8c878]">
                          {user.is_active ? "Deactivate" : "Activate"}
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

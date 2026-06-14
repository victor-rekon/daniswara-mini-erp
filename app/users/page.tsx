import { AppShell } from "@/components/layout/app-shell";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { ROLE_LABELS, type UserRole } from "@/lib/access/roles";

export const dynamic = "force-dynamic";

type AppUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
};

function roleBadge(role: UserRole) {
  if (role === "owner") return "border-[#d9b25c]/25 bg-[#d9b25c]/[0.10] text-[#e8c878]";
  if (role === "admin") return "border-blue-400/25 bg-blue-400/[0.08] text-blue-300";
  if (role === "finance") return "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300";
  return "border-slate-400/25 bg-slate-400/[0.08] text-slate-300";
}

export default async function UsersPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from("app_users")
    .select("id, name, email, role, is_active, created_at")
    .order("created_at", { ascending: true });

  const users = (data ?? []) as AppUser[];

  return (
    <AppShell title="Users" description="Manage internal demo and UAT users.">
      <div className="grid gap-4 md:gap-5">
        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Access Control</p>
          <h1 className="mt-1 text-xl font-bold text-[#e2e8f0]">Users & Roles</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
            Basic user registry for demo, UAT, and handover. Owner and Admin can review which role each internal user should use.
          </p>
        </section>

        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#e2e8f0]">Registered users</h2>
              <p className="mt-1 text-xs text-[#94a3b8]">{users.length} user(s) configured.</p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-xl border border-white/[0.07]">
            <table className="min-w-full divide-y divide-white/[0.07] text-sm">
              <thead className="bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.14em] text-[#94a3b8]">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {users.map((user) => (
                  <tr key={user.id} className="text-[#e2e8f0]">
                    <td className="px-4 py-3 font-semibold">{user.name}</td>
                    <td className="px-4 py-3 text-[#94a3b8]">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${roleBadge(user.role)}`}>
                        {ROLE_LABELS[user.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${user.is_active ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300" : "border-red-400/25 bg-red-400/[0.08] text-red-300"}`}>
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
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

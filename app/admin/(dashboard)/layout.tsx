import Link from "next/link";
import {
  LayoutDashboard,
  FolderKanban,
  User,
  GraduationCap,
  Layers,
  ChartColumn,
  Share2,
  ContactRound,
  Settings,
  Inbox,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logoutAction } from "@/lib/actions/auth";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Projects", href: "/admin/projects", icon: FolderKanban },
  { name: "Hero", href: "/admin/hero", icon: User },
  { name: "About", href: "/admin/about", icon: User },
  { name: "Education", href: "/admin/education", icon: GraduationCap },
  { name: "Stacks", href: "/admin/stacks", icon: Layers },
  { name: "Stats", href: "/admin/stats", icon: ChartColumn },
  { name: "Contact", href: "/admin/contact", icon: ContactRound },
  { name: "Socials", href: "/admin/socials", icon: Share2 },
  { name: "Site Config", href: "/admin/site-config", icon: Settings },
  { name: "Messages", href: "/admin/messages", icon: Inbox },
];

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 bg-slate-900/50 p-4 flex flex-col">
        <div className="px-2 py-3">
          <p className="text-lg font-bold text-white">AkPrisma CMS</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>

        <nav className="mt-4 flex-1 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="space-y-2 border-t border-white/10 pt-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

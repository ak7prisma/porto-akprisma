import Link from "next/link";
import {
  FolderKanban,
  User,
  Share2,
  Settings,
  Inbox,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const cards = [
  { name: "Projects", href: "/admin/projects", icon: FolderKanban, desc: "Manage portfolio projects" },
  { name: "Hero", href: "/admin/hero", icon: User, desc: "Edit hero section content" },
  { name: "Socials", href: "/admin/socials", icon: Share2, desc: "Manage social links" },
  { name: "Site Config", href: "/admin/site-config", icon: Settings, desc: "Site name, email, CV link" },
  { name: "Messages", href: "/admin/messages", icon: Inbox, desc: "View contact messages" },
];

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: projects }, { count: messages }] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("is_published", true),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("status", "new"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Manage your portfolio content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-xl border border-white/10 bg-slate-900/50 p-6 transition-colors hover:border-blue-500/40"
          >
            <div className="flex items-start justify-between">
              <card.icon className="h-8 w-8 text-blue-400" />
              <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
            </div>
            <h3 className="mt-4 font-semibold text-white">{card.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{card.desc}</p>
          </Link>
        ))}

        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <div className="flex items-start justify-between">
            <FolderKanban className="h-8 w-8 text-cyan-400" />
          </div>
          <h3 className="mt-4 font-semibold text-white">Published Projects</h3>
          <p className="mt-1 text-sm text-slate-400">{projects ?? 0} live on the site</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-slate-900/50 p-6">
          <div className="flex items-start justify-between">
            <Inbox className="h-8 w-8 text-amber-400" />
          </div>
          <h3 className="mt-4 font-semibold text-white">New Messages</h3>
          <p className="mt-1 text-sm text-slate-400">{messages ?? 0} unread messages</p>
        </div>
      </div>
    </div>
  );
}

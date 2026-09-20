import Link from "next/link";
import { ArrowLeft, Database, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatItem, StatForm } from "@/components/admin/StatForm";
import { getPublicSiteData } from "@/lib/content";
import type { PublicStat } from "@/types/content";

export const metadata = {
  title: "Stats | Admin",
};

export default async function AdminStatsPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: statRows } = await supabase
    .from("stats")
    .select("*")
    .order("sort_order");

  const stats: PublicStat[] = statRows?.length
    ? statRows.map((s) => ({
        id: s.id,
        label: s.label,
        subLabel: s.sub_label,
        icon: s.icon,
        color: s.color,
        background: s.background,
      }))
    : fallback.stats;

  const isLive = Boolean(statRows?.length);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Stats</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {isLive ? "Editing from Supabase" : "Supabase not configured — showing fallback values"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <Plus className="h-4 w-4 text-blue-400" />
        Add a new stat
      </div>
      <StatForm />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-300">Existing stats</h2>
        {stats.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-slate-400">
            No stats yet. Add one above to get started.
          </p>
        ) : (
          stats.map((s) => <StatItem key={s.id} stat={s} />)
        )}
      </div>
    </div>
  );
}
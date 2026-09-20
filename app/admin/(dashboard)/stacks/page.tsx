import Link from "next/link";
import { ArrowLeft, Database, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StackItem, StackForm } from "@/components/admin/StackForm";
import { getPublicSiteData } from "@/lib/content";
import type { PublicStack } from "@/types/content";

export const metadata = {
  title: "Stacks | Admin",
};

export default async function AdminStacksPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: stackRows } = await supabase
    .from("stacks")
    .select("*")
    .order("sort_order");

  const stacks: PublicStack[] = stackRows?.length
    ? stackRows.map((s) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        icon: s.icon,
        color: s.color,
      }))
    : fallback.stacks;

  const isLive = Boolean(stackRows?.length);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Stacks</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {isLive ? "Editing from Supabase" : "Supabase not configured — showing fallback values"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <Plus className="h-4 w-4 text-blue-400" />
        Add a new stack
      </div>
      <StackForm />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-300">Existing stacks</h2>
        {stacks.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-slate-400">
            No stacks yet. Add one above to get started.
          </p>
        ) : (
          stacks.map((s) => <StackItem key={s.id} stack={s} />)
        )}
      </div>
    </div>
  );
}
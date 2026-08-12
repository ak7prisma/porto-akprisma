import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import HeroForm from "@/components/admin/HeroForm";
import { getPublicSiteData } from "@/lib/content";

export const metadata = {
  title: "Hero | Admin",
};

export default async function AdminHeroPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: heroRow } = await supabase.from("hero").select("*").limit(1).maybeSingle();

  const hero = heroRow
    ? {
        name: heroRow.name,
        role: heroRow.role,
        status: heroRow.status,
        description: heroRow.description,
        initial: heroRow.initial,
        initialBadge: heroRow.initial_badge,
      }
    : fallback.hero;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Hero</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {heroRow ? "Editing from Supabase" : "Supabase not configured — editing static fallback values"}
        </p>
      </div>

      <HeroForm hero={hero} heroId={heroRow?.id} />
    </div>
  );
}

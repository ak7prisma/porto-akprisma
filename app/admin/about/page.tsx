import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import AboutForm from "@/components/admin/AboutForm";
import { getPublicSiteData } from "@/lib/content";

export const metadata = {
  title: "About | Admin",
};

export default async function AdminAboutPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: aboutRow } = await supabase.from("about").select("*").limit(1).maybeSingle();

  let bios: { id: string; content: string }[] = [];
  if (aboutRow) {
    const { data: bioRows } = await supabase
      .from("about_bios")
      .select("*")
      .eq("about_id", aboutRow.id)
      .order("sort_order");
    bios = (bioRows ?? []).map((b) => ({ id: b.id, content: b.content }));
  }

  const about = aboutRow
    ? { headline: aboutRow.headline, bios }
    : fallback.about;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">About</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {aboutRow ? "Editing from Supabase" : "Supabase not configured — editing static fallback values"}
        </p>
      </div>

      <AboutForm about={about} aboutId={aboutRow?.id} />
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft, Database, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SocialForm, SocialDeleteButton } from "@/components/admin/SocialForm";
import { getPublicSiteData } from "@/lib/content";
import type { PublicSocial } from "@/types/content";

export const metadata = {
  title: "Socials | Admin",
};

export default async function AdminSocialsPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: socialRows } = await supabase
    .from("socials")
    .select("*")
    .order("sort_order");

  const socials: PublicSocial[] = socialRows?.length
    ? socialRows.map((s) => ({ id: s.id, name: s.name, href: s.href, icon: s.icon }))
    : fallback.socials;

  const isLive = Boolean(socialRows?.length);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Social Links</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {isLive ? "Editing from Supabase" : "Supabase not configured — showing fallback values"}
        </p>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <Plus className="h-4 w-4 text-blue-400" />
        Add a new link
      </div>
      <SocialForm />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-300">Existing links</h2>
        {socials.map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3"
          >
            <div className="min-w-0">
              <p className="font-medium text-white">{s.name}</p>
              <p className="truncate text-sm text-slate-400">{s.href}</p>
            </div>
            <SocialDeleteButton social={s} />
          </div>
        ))}
      </div>
    </div>
  );
}

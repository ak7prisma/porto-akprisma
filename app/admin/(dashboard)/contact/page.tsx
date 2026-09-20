import Link from "next/link";
import { ArrowLeft, Database, Share2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ContactSettingsForm from "@/components/admin/ContactSettingsForm";
import { SocialForm, SocialItem } from "@/components/admin/SocialForm";
import { getPublicSiteData } from "@/lib/content";
import type { PublicSocial } from "@/types/content";

export const metadata = {
  title: "Contact | Admin",
};

export default async function AdminContactPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: configRow } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .maybeSingle();

  const { data: socialRows } = await supabase
    .from("socials")
    .select("*")
    .order("sort_order");

  const config = {
    contactHeading: configRow?.contact_heading ?? fallback.siteConfig.contactHeading,
    contactIntro: configRow?.contact_intro ?? fallback.siteConfig.contactIntro,
    email: configRow?.email ?? fallback.siteConfig.email,
    location: configRow?.location ?? fallback.siteConfig.location,
  };

  const socials: PublicSocial[] = socialRows?.length
    ? socialRows.map((s) => ({ id: s.id, name: s.name, href: s.href, icon: s.icon }))
    : fallback.socials;

  const isLive = Boolean(configRow || socialRows?.length);

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Contact</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {isLive ? "Editing from Supabase" : "Supabase not configured — showing fallback values"}
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-300">Contact section content</h2>
        <ContactSettingsForm config={config} configId={configRow?.id} />
      </div>

      <div className="flex items-center gap-2 pt-2 text-sm font-medium text-slate-200">
        <Share2 className="h-4 w-4 text-blue-400" />
        Social links shown on the contact section
      </div>
      <SocialForm />

      <div className="space-y-2">
        <h2 className="text-sm font-medium text-slate-300">Existing links</h2>
        {socials.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/15 p-8 text-center text-slate-400">
            No social links yet. Add one above to get started.
          </p>
        ) : (
          socials.map((s) => <SocialItem key={s.id} social={s} />)
        )}
      </div>
    </div>
  );
}
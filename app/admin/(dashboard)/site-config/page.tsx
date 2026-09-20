import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import SiteConfigForm from "@/components/admin/SiteConfigForm";
import { getPublicSiteData } from "@/lib/content";

export const metadata = {
  title: "Site Config | Admin",
};

export default async function AdminSiteConfigPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: configRow } = await supabase
    .from("site_config")
    .select("*")
    .limit(1)
    .maybeSingle();

  const config = configRow
    ? {
        siteName: configRow.site_name,
        tagline: configRow.site_tagline,
        email: configRow.email,
        location: configRow.location,
        cvLink: configRow.cv_link,
        footerText: configRow.footer_text,
        contactHeading: configRow.contact_heading ?? fallback.siteConfig.contactHeading,
        contactIntro: configRow.contact_intro ?? fallback.siteConfig.contactIntro,
      }
    : fallback.siteConfig;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Site Config</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {configRow ? "Editing from Supabase" : "Supabase not configured — editing static fallback values"}
        </p>
      </div>

      <SiteConfigForm config={config} configId={configRow?.id} />
    </div>
  );
}

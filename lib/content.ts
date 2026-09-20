import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { siteContentFallback } from "@/data/content";
import type { ContactMessage, PublicSiteData } from "@/types/content";

export type { PublicSiteData };

export const isSupabaseConfigured = () => {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
};

export const getPublicSiteData = cache(
  async (): Promise<PublicSiteData> => {
    if (!isSupabaseConfigured()) {
      return siteContentFallback;
    }

    const supabase = await createClient();

    const [siteConfig, hero, about, education, stacks, stats, projects, socials] =
      await Promise.all([
        supabase.from("site_config").select("*").limit(1).maybeSingle(),
        supabase.from("hero").select("*").limit(1).maybeSingle(),
        supabase.from("about").select("*, about_bios(*)").limit(1).maybeSingle(),
        supabase.from("education").select("*").limit(1).maybeSingle(),
        supabase
          .from("stacks")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("stats")
          .select("*")
          .order("sort_order", { ascending: true }),
        supabase
          .from("projects")
          .select("*")
          .eq("is_published", true)
          .order("sort_order", { ascending: true }),
        supabase
          .from("socials")
          .select("*")
          .order("sort_order", { ascending: true }),
      ]);

    if (
      siteConfig.error ||
      hero.error ||
      about.error ||
      education.error ||
      stacks.error ||
      stats.error ||
      projects.error ||
      socials.error
    ) {
      return siteContentFallback;
    }

    return {
      nav: siteContentFallback.nav,
      siteConfig: {
        siteName: siteConfig.data?.site_name ?? siteContentFallback.siteConfig.siteName,
        tagline: siteConfig.data?.site_tagline ?? siteContentFallback.siteConfig.tagline,
        email: siteConfig.data?.email ?? siteContentFallback.siteConfig.email,
        location: siteConfig.data?.location ?? siteContentFallback.siteConfig.location,
        cvLink: siteConfig.data?.cv_link ?? siteContentFallback.siteConfig.cvLink,
        footerText: siteConfig.data?.footer_text ?? siteContentFallback.siteConfig.footerText,
        contactHeading: siteConfig.data?.contact_heading || siteContentFallback.siteConfig.contactHeading,
        contactIntro: siteConfig.data?.contact_intro || siteContentFallback.siteConfig.contactIntro,
      },
      hero: {
        name: hero.data?.name ?? siteContentFallback.hero.name,
        role: hero.data?.role ?? siteContentFallback.hero.role,
        status: hero.data?.status ?? siteContentFallback.hero.status,
        description: hero.data?.description ?? siteContentFallback.hero.description,
        initial: hero.data?.initial ?? siteContentFallback.hero.initial,
        initialBadge: hero.data?.initial_badge ?? siteContentFallback.hero.initialBadge,
      },
      about: {
        headline: about.data?.headline ?? siteContentFallback.about.headline,
        bios:
          (about.data?.about_bios as { content: string }[])?.map((b) => ({
            id: crypto.randomUUID(),
            content: b.content,
          })) ?? siteContentFallback.about.bios,
      },
      education: {
        year: education.data?.year ?? siteContentFallback.education.year,
        degree: education.data?.degree ?? siteContentFallback.education.degree,
        university: education.data?.university ?? siteContentFallback.education.university,
        description: education.data?.description ?? siteContentFallback.education.description,
      },
      stacks:
        stacks.data?.map((s) => ({
          id: s.id,
          title: s.title,
          description: s.description,
          icon: s.icon,
          color: s.color,
        })) ?? siteContentFallback.stacks,
      stats:
        stats.data?.map((s) => ({
          id: s.id,
          label: s.label,
          subLabel: s.sub_label,
          icon: s.icon,
          color: s.color,
          background: s.background,
        })) ?? siteContentFallback.stats,
      projects:
        projects.data?.map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          description: p.description,
          desktopImage: p.desktop_image,
          mobileImage: p.mobile_image,
          tech: p.tech,
          demoUrl: p.demo_url,
          githubUrl: p.github_url,
        })) ?? siteContentFallback.projects,
      socials:
        socials.data?.map((s) => ({
          id: s.id,
          name: s.name,
          href: s.href,
          icon: s.icon,
        })) ?? siteContentFallback.socials,
    };
  }
);

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as ContactMessage[];
}

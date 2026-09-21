import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPublicSiteData, isSupabaseConfigured } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getPublicSiteData();

  const isAdmin = isSupabaseConfigured()
    ? (await (await createClient()).auth.getUser()).data.user != null
    : false;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute -top-40 left-1/2 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(161,161,170,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[80px_80px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <Navbar isAdmin={isAdmin} />

      <main className="relative min-h-screen overflow-x-hidden">
        {children}
      </main>

      <Footer siteConfig={data.siteConfig} socials={data.socials} />
    </>
  );
}
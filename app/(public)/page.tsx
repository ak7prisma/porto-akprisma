import About from "@/components/AboutSection";
import Contact from "@/components/ContactSection";
import Hero from "@/components/HeroSection";
import Projects from "@/components/ProjectsSection";
import { getPublicSiteData } from "@/lib/content";

export default async function Home() {
  const data = await getPublicSiteData();

  return (
    <main className="flex flex-col w-full overflow-x-hidden">
      <Hero hero={data.hero} siteConfig={data.siteConfig} />
      <About
        about={data.about}
        education={data.education}
        stacks={data.stacks}
        stats={data.stats}
      />
      <Projects projects={data.projects} />
      <Contact siteConfig={data.siteConfig} socials={data.socials} />
    </main>
  );
}
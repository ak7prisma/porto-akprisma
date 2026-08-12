import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/EmailForm";
import type { PublicSiteConfig, PublicSocial } from "@/types/content";

export default function Contact({
  siteConfig,
  socials,
}: {
  siteConfig: PublicSiteConfig;
  socials: PublicSocial[];
}) {
  return (
    <section id="contact" className="relative py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <ContactInfo siteConfig={siteConfig} socials={socials} />
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

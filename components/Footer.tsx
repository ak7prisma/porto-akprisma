"use client";

import { motion, useReducedMotion } from "framer-motion";
import FooterButton from "@/components/ui/FooterButton";
import SocialMedia from "@/components/ui/SocialMedia";
import FooterLogo from "@/components/ui/FooterLogo";
import type { PublicSiteConfig, PublicSocial } from "@/types/content";

export default function Footer({
  siteConfig,
  socials,
}: {
  siteConfig: PublicSiteConfig;
  socials: PublicSocial[];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.footer
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.2 }}
      className="relative border-t border-border pt-16 pb-8"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 grid grid-cols-1 gap-10 text-center md:grid-cols-4 md:text-left">
          <FooterLogo siteConfig={siteConfig} />
          <FooterButton />
          <SocialMedia socials={socials} />
        </div>

        <div className="flex flex-col items-center justify-center gap-6 border-t border-border pt-8">
          <p className="font-label text-xs text-muted-foreground">
            © {new Date().getFullYear()} Ahmad Kurnia Prisma | {siteConfig.email}
          </p>
        </div>
      </div>
    </motion.footer>
  );
}

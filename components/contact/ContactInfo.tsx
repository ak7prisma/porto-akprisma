"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Mail, MapPin } from "lucide-react";
import { fadeUp } from "@/lib/animation";
import { getIcon } from "@/lib/icons";
import type { PublicSiteConfig, PublicSocial } from "@/types/content";

export default function ContactInfo({
  siteConfig,
  socials,
}: {
  siteConfig: PublicSiteConfig;
  socials: PublicSocial[];
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="space-y-10"
    >
      <div className="space-y-5">
        <h2 className="text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
          Let&apos;s work together
        </h2>
        <p className="max-w-md text-base leading-relaxed text-muted-foreground">
          Have a project in mind or just want to say hi? I&apos;m currently open to new
          opportunities and collaborations.
        </p>
      </div>

      <div className="space-y-4">
        <a
          href={`mailto:${siteConfig.email}`}
          className="group flex items-center gap-4 text-muted-foreground transition-colors hover:text-foreground"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary transition-colors group-hover:border-ring">
            <Mail size={18} />
          </span>
          <span className="font-label text-sm">{siteConfig.email}</span>
        </a>

        <div className="flex items-center gap-4 text-muted-foreground">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary">
            <MapPin size={18} />
          </span>
          <span className="font-label text-sm">{siteConfig.location}</span>
        </div>
      </div>

      <div className="border-t border-border pt-8">
        <p className="mb-4 font-label text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Find me on
        </p>
        <div className="flex gap-3">
          {socials.map((social) => {
            const Icon = getIcon(social.icon);
            return (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground transition-colors hover:border-ring hover:text-foreground"
              >
                <Icon size={17} />
              </a>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

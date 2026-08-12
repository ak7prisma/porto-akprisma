"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ProfilCard from "@/components/hero/ProfilCard";
import type { PublicHero, PublicSiteConfig } from "@/types/content";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const maskReveal = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero({
  hero,
  siteConfig,
}: {
  hero: PublicHero;
  siteConfig: PublicSiteConfig;
}) {
  const reduce = useReducedMotion();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-32 pb-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_20%_40%,rgba(161,161,170,0.06),transparent)]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            variants={reduce ? undefined : container}
            initial={reduce ? false : "hidden"}
            animate={reduce ? {} : "visible"}
            className="space-y-8"
          >
            <motion.div variants={maskReveal}>
              <Badge variant="outline" withDot>
                {hero.status}
              </Badge>
            </motion.div>

            <div className="space-y-5">
              <motion.p
                variants={maskReveal}
                className="font-label text-sm uppercase tracking-[0.2em] text-muted-foreground"
              >
                {hero.role}
              </motion.p>

              <motion.h1
                variants={maskReveal}
                className="text-5xl font-medium leading-[1.04] tracking-tight text-foreground md:text-6xl lg:text-7xl"
              >
                {hero.name}
              </motion.h1>
            </div>

            <motion.p
              variants={maskReveal}
              className="max-w-2xl text-lg leading-relaxed text-muted-foreground"
            >
              {hero.description}
            </motion.p>

            <motion.div
              variants={maskReveal}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <Button href="#projects" variant="primary" size="lg" icon={<ArrowRight size={18} />}>
                View Work
              </Button>
              <Button
                href={siteConfig.cvLink ?? "#"}
                variant="secondary"
                size="lg"
                icon={<Download size={18} />}
              >
                Download CV
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={reduce ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="hidden justify-end lg:flex"
          >
            <ProfilCard hero={hero} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

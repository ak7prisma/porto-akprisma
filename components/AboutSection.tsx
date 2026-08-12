"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer } from "@/lib/animation";
import AboutLeft from "@/components/about/AboutLeft";
import AboutRight from "@/components/about/AboutRight";
import type {
  PublicAbout,
  PublicEducation,
  PublicStack,
  PublicStat,
} from "@/types/content";

export default function About({
  about,
  education,
  stacks,
  stats,
}: {
  about: PublicAbout;
  education: PublicEducation;
  stacks: PublicStack[];
  stats: PublicStat[];
}) {
  const reduce = useReducedMotion();

  return (
    <section id="about" className="relative py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20"
          variants={reduce ? undefined : staggerContainer}
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, amount: 0.2 }}
        >
          <AboutLeft about={about} stats={stats} />
          <AboutRight education={education} stacks={stacks} />
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/animation";
import { getIcon } from "@/lib/icons";
import type { PublicAbout, PublicStat } from "@/types/content";

export default function AboutLeft({
  about,
  stats,
}: {
  about: PublicAbout;
  stats: PublicStat[];
}) {
  return (
    <div className="space-y-10 lg:sticky lg:top-32">
      <motion.div variants={fadeUp} className="space-y-6">
        <h2 className="max-w-xl text-4xl font-medium leading-[1.08] tracking-tight text-foreground md:text-5xl">
          {about.headline}
        </h2>
      </motion.div>

      <motion.div variants={fadeUp} className="max-w-xl space-y-5 text-base leading-relaxed text-muted-foreground">
        {about.bios.map((item) => (
          <p key={item.id}>{item.content}</p>
        ))}
      </motion.div>

      <motion.div variants={fadeUp} className="border-t border-border pt-8">
        <div className="grid grid-cols-2 gap-8">
          {stats.map((stat) => {
            const Icon = getIcon(stat.icon);
            return (
              <div key={stat.id} className="space-y-2">
                <Icon size={20} className="text-foreground/70" />
                <h4 className="text-lg font-medium text-foreground">{stat.label}</h4>
                <p className="text-sm text-muted-foreground">{stat.subLabel}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

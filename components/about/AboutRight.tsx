"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { fadeUp } from "@/lib/animation";
import { getIcon } from "@/lib/icons";
import type { PublicEducation, PublicStack } from "@/types/content";

export default function AboutRight({
  education,
  stacks,
}: {
  education: PublicEducation;
  stacks: PublicStack[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5">
      <motion.div variants={fadeUp}>
        <Card className="group p-6 transition-colors hover:border-ring/60">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary">
                <GraduationCap size={20} className="text-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">{education.degree}</h3>
                <p className="text-sm text-muted-foreground">{education.university}</p>
              </div>
            </div>
            <span className="font-label text-xs uppercase tracking-wider text-muted-foreground">
              {education.year}
            </span>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            {education.description}
          </p>
        </Card>
      </motion.div>

      {stacks.map((stack) => {
        const Icon = getIcon(stack.icon);
        return (
          <motion.div key={stack.id} variants={fadeUp}>
            <Card className="group p-6 transition-colors hover:border-ring/60">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary">
                    <Icon size={20} className="text-foreground" />
                  </div>
                  <h3 className="text-lg font-medium text-foreground">{stack.title}</h3>
                </div>
              </div>
              <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                {stack.description}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

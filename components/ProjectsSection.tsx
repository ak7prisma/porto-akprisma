"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/animation";
import ProjectCard from "@/components/project/ProjectCard";
import type { PublicProject } from "@/types/content";

export default function Projects({ projects }: { projects: PublicProject[] }) {
  const reduce = useReducedMotion();
  if (!projects.length) return null;

  const [featured, ...rest] = projects;

  return (
    <section id="projects" className="relative py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-6">
        <motion.div
          initial={reduce ? false : "hidden"}
          whileInView={reduce ? undefined : "visible"}
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          className="mb-16 space-y-4"
        >
          <p className="font-label text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Selected Work
          </p>
          <h2 className="max-w-2xl text-4xl font-medium leading-[1.08] tracking-tight md:text-5xl">
            Projects
          </h2>
        </motion.div>

        <div className="space-y-24">
          <ProjectCard project={featured} index={0} featured />

          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
              {rest.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

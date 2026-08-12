"use client";

import { motion, useReducedMotion } from "framer-motion";
import ProjectPreview from "@/components/project/ProjectPreview";
import ProjectDetails from "@/components/project/ProjectDetail";
import type { PublicProject } from "@/types/content";

export default function ProjectCard({
  project,
  index,
  featured = false,
}: Readonly<{
  project: PublicProject;
  index: number;
  featured?: boolean;
}>) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.05 }}
      className={`flex flex-col gap-8 ${featured ? "lg:flex-row lg:items-center lg:gap-14" : ""}`}
    >
      <ProjectPreview project={project} />
      <ProjectDetails project={project} featured={featured} />
    </motion.article>
  );
}

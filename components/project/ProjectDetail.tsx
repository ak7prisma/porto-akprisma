import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import ActionProject from "@/components/project/ActionProject";
import type { PublicProject } from "@/types/content";

export default function ProjectDetails({
  project,
  featured = false,
}: Readonly<{ project: PublicProject; featured?: boolean }>) {
  return (
    <div className={`space-y-6 ${featured ? "w-full lg:w-2/5" : "w-full"}`}>
      <div className="space-y-3">
        <p className="font-label text-xs uppercase tracking-[0.18em] text-muted-foreground">
          {project.category}
        </p>
        <h3 className="text-2xl font-medium tracking-tight text-foreground md:text-3xl">
          {project.title}
        </h3>
      </div>

      <p className="text-base leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {project.tech.map((tech) => (
          <span key={tech} className="font-label text-xs uppercase tracking-wider text-muted-foreground">
            {tech}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <ActionProject
          href={project.demoUrl}
          label="Live Demo"
          icon={<ExternalLink size={16} />}
          variant="primary"
        />
        <ActionProject
          href={project.githubUrl}
          label="Code"
          icon={<FaGithub size={16} />}
          variant="outline"
          lockedLabel="Private Code"
        />
      </div>
    </div>
  );
}

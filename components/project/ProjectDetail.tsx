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

      {(project.problem || project.solution) && (
        <div className="space-y-4 rounded-lg border border-border bg-secondary/50 p-5">
          {project.problem && (
            <div className="space-y-1.5">
              <p className="font-label text-xs uppercase tracking-wider text-muted-foreground">
                Problem
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">{project.problem}</p>
            </div>
          )}
          {project.problem && project.solution && <div className="h-px bg-border" />}
          {project.solution && (
            <div className="space-y-1.5">
              <p className="font-label text-xs uppercase tracking-wider text-muted-foreground">
                Solution
              </p>
              <p className="text-sm leading-relaxed text-foreground/80">{project.solution}</p>
            </div>
          )}
        </div>
      )}

      {project.tech.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="font-label text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70">
            Stack
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="font-label text-[11px] uppercase tracking-wider text-muted-foreground/60"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

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

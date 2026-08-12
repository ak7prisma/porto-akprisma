"use client";

import { useState } from "react";
import { Monitor, Smartphone } from "lucide-react";
import ProjectImage from "@/components/project/ProjectImage";
import type { PublicProject } from "@/types/content";

interface ProjectPreviewProps {
  project: PublicProject;
}

export default function ProjectPreview({ project }: Readonly<ProjectPreviewProps>) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  return (
    <div className="group w-full lg:w-3/5">
      <div className="relative overflow-hidden rounded-lg border border-border bg-secondary shadow-sm">
        <div
          className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out origin-top ${
            viewMode === "mobile" ? "aspect-9/19 mx-auto w-3/5 my-6" : "aspect-16/10"
          }`}
        >
          <ProjectImage
            src={project.desktopImage}
            alt={`${project.title} desktop view`}
            isVisible={viewMode === "desktop"}
          />
          <ProjectImage
            src={project.mobileImage}
            alt={`${project.title} mobile view`}
            isVisible={viewMode === "mobile"}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 rounded-full border border-border bg-secondary p-1 w-fit">
        {[
          { mode: "desktop", icon: <Monitor size={13} />, label: "Desktop" },
          { mode: "mobile", icon: <Smartphone size={13} />, label: "Mobile" },
        ].map((item) => (
          <button
            key={item.mode}
            onClick={() => setViewMode(item.mode as "desktop" | "mobile")}
            aria-label={`View ${item.label} preview`}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 font-label text-xs uppercase tracking-wider transition-colors ${
              viewMode === item.mode
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

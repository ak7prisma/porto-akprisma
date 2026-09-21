"use client";

import { useState } from "react";
import { Monitor, Smartphone, ImageOff } from "lucide-react";
import ProjectImage from "@/components/project/ProjectImage";
import type { PublicProject } from "@/types/content";

interface ProjectPreviewProps {
  project: PublicProject;
}

export default function ProjectPreview({ project }: Readonly<ProjectPreviewProps>) {
  const hasDesktop = Boolean(project.desktopImage);
  const hasMobile = Boolean(project.mobileImage);

  const [viewMode, setViewMode] = useState<"desktop" | "mobile">(
    !hasDesktop && hasMobile ? "mobile" : "desktop"
  );

  const views = [
    ...(hasDesktop
      ? [{ mode: "desktop" as const, icon: <Monitor size={13} />, label: "Desktop" }]
      : []),
    ...(hasMobile
      ? [{ mode: "mobile" as const, icon: <Smartphone size={13} />, label: "Mobile" }]
      : []),
  ];

  return (
    <div className="group w-full lg:w-3/5">
      <div className="relative overflow-hidden rounded-lg border border-border bg-secondary shadow-sm">
        {!hasDesktop && !hasMobile ? (
          <div className="flex aspect-16/10 w-full items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageOff size={18} />
            No preview available
          </div>
        ) : (
          <div
            className={`relative w-full overflow-hidden transition-all duration-500 ease-in-out origin-top ${
              viewMode === "mobile" ? "aspect-16/11" : "aspect-16/10"
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
              className="absolute inset-y-0 left-1/2 w-2/5 -translate-x-1/2"
            />
          </div>
        )}
      </div>

      {views.length > 0 && (
        <div className="mt-4 flex items-center gap-1 rounded-full border border-border bg-secondary p-1 w-fit">
          {views.map((item) => (
            <button
              key={item.mode}
              onClick={() => setViewMode(item.mode)}
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
      )}
    </div>
  );
}
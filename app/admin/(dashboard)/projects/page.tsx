import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  ProjectCreateDialog,
  ProjectEditDialog,
  ProjectDeleteButton,
  ProjectPublishToggle,
  type AdminProject,
} from "@/components/admin/ProjectForm";

async function getProjects(): Promise<AdminProject[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error || !data) return [];

  return data.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    description: p.description,
    tech: p.tech ?? [],
    desktopImage: p.desktop_image,
    mobileImage: p.mobile_image,
    demoUrl: p.demo_url,
    githubUrl: p.github_url,
    sortOrder: p.sort_order,
    isPublished: p.is_published,
  }));
}

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">
            {projects.length} project(s). Content is currently read from static fallback data when
            Supabase is not configured.
          </p>
        </div>
        <ProjectCreateDialog />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-12 text-center text-slate-400">
          <p>No projects yet. Create your first project to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-4 rounded-xl border border-white/10 bg-slate-900/50 p-4"
            >
              <div className="flex min-w-0 items-center gap-4">
                {p.desktopImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.desktopImage}
                    alt={p.title}
                    className="h-14 w-20 shrink-0 rounded-lg border border-white/10 object-cover object-top"
                  />
                ) : (
                  <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-white/15 text-xs text-slate-500">
                    No image
                  </div>
                )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-white">{p.title}</h3>
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
                      {p.category}
                    </span>
                    {p.isPublished ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                        Published
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-1 text-sm text-slate-400">{p.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <ProjectPublishToggle project={p} />
                <ProjectEditDialog project={p} />
                <ProjectDeleteButton project={p} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  saveProjectAction,
  deleteProjectAction,
  toggleProjectPublishAction,
} from "@/lib/actions/projects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { PublicProject } from "@/types/content";

export type AdminProject = PublicProject & {
  sortOrder: number;
  isPublished: boolean;
};

const emptyForm = {
  id: undefined as number | undefined,
  title: "",
  category: "",
  description: "",
  desktop_image: "",
  mobile_image: "",
  tech: "",
  demo_url: "",
  github_url: "",
  sort_order: 0,
  is_published: true,
};

export function ProjectForm({
  project,
  onSaved,
}: {
  project?: AdminProject;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(saveProjectAction, null);
  const [form, setForm] = useState(() =>
    project
      ? {
          id: project.id,
          title: project.title,
          category: project.category,
          description: project.description,
          desktop_image: project.desktopImage ?? "",
          mobile_image: project.mobileImage ?? "",
          tech: project.tech.join(", "),
          demo_url: project.demoUrl ?? "",
          github_url: project.githubUrl ?? "",
          sort_order: project.sortOrder,
          is_published: project.isPublished,
        }
      : emptyForm
  );

  const set = (key: keyof typeof form, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onSaved?.();
    }
  }, [state, router, onSaved]);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={form.id ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech">Tech stack (comma separated)</Label>
        <Input
          id="tech"
          name="tech"
          value={form.tech}
          onChange={(e) => set("tech", e.target.value)}
          placeholder="Next.js, Tailwind CSS, Supabase"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ImageUpload
          label="Desktop image"
          value={form.desktop_image}
          onChange={(url) => set("desktop_image", url)}
        />
        <ImageUpload
          label="Mobile image"
          value={form.mobile_image}
          onChange={(url) => set("mobile_image", url)}
        />
      </div>

      <input type="hidden" name="desktop_image" value={form.desktop_image} />
      <input type="hidden" name="mobile_image" value={form.mobile_image} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="demo_url">Live demo URL</Label>
          <Input
            id="demo_url"
            name="demo_url"
            value={form.demo_url}
            onChange={(e) => set("demo_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            name="github_url"
            value={form.github_url}
            onChange={(e) => set("github_url", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            value={form.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
          />
        </div>
        <div className="flex h-full items-end pb-1">
          <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
              type="checkbox"
              name="is_published"
              checked={form.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-slate-600 bg-slate-900 accent-blue-500"
            />
            Published (visible on site)
          </label>
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">{String(state.error)}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}

export function ProjectDeleteButton({ project }: { project: AdminProject }) {
  const router = useRouter();
  return (
    <form
      action={async () => {
        await deleteProjectAction(project.id);
        router.refresh();
      }}
    >
      <Button type="submit" variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
        Delete
      </Button>
    </form>
  );
}

export function ProjectPublishToggle({ project }: { project: AdminProject }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      disabled={pending}
      onClick={async () => {
        setPending(true);
        await toggleProjectPublishAction(project.id, !project.isPublished);
        router.refresh();
        setPending(false);
      }}
    >
      {project.isPublished ? "Unpublish" : "Publish"}
    </Button>
  );
}

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="primary">+ New Project</Button>} />
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Add a new project to your portfolio.</DialogDescription>
        </DialogHeader>
        <ProjectForm onSaved={() => setOpen(false)} />
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}

export function ProjectEditDialog({ project }: { project: AdminProject }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm">Edit</Button>} />
      <DialogContent className="sm:max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details.</DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} onSaved={() => setOpen(false)} />
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  saveProjectAction,
  deleteProjectAction,
} from "@/lib/actions/projects";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PublicProject } from "@/types/content";

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

export function ProjectForm({ project }: { project?: PublicProject }) {
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
          sort_order: 0,
          is_published: true,
        }
      : emptyForm
  );

  const set = (key: keyof typeof form, value: string | boolean | number) =>
    setForm((f) => ({ ...f, [key]: value }));

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
        <div className="space-y-2">
          <Label htmlFor="desktop_image">Desktop image URL</Label>
          <Input
            id="desktop_image"
            name="desktop_image"
            value={form.desktop_image}
            onChange={(e) => set("desktop_image", e.target.value)}
            placeholder="/Starshop.png or https://..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mobile_image">Mobile image URL</Label>
          <Input
            id="mobile_image"
            name="mobile_image"
            value={form.mobile_image}
            onChange={(e) => set("mobile_image", e.target.value)}
            placeholder="/StarshopMobile.png or https://..."
          />
        </div>
      </div>

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

      {state?.error && (
        <p className="text-sm text-red-400">{String(state.error)}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full">
        {project ? "Update Project" : "Create Project"}
      </Button>
    </form>
  );
}

export function ProjectDeleteButton({ project }: { project: PublicProject }) {
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

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>Add a new project to your portfolio.</DialogDescription>
        </DialogHeader>
        <ProjectForm />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ProjectEditDialog({ project }: { project: PublicProject }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>Update project details.</DialogDescription>
        </DialogHeader>
        <ProjectForm project={project} />
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

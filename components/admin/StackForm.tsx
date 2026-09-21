"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createStackAction,
  updateStackAction,
  deleteStackAction,
} from "@/lib/actions/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { useActionToast } from "@/components/admin/useActionToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { PublicStack } from "@/types/content";

export function StackForm({ stack }: { stack?: PublicStack }) {
  const [state, formAction] = useActionState(
    stack ? updateStackAction : createStackAction,
    null
  );
  useActionToast(state, { success: stack ? "Stack updated" : "Stack added" });
  const [form, setForm] = useState({
    title: stack?.title ?? "",
    description: stack?.description ?? "",
    icon: stack?.icon ?? "LayoutDashboard",
    color: stack?.color ?? "",
    sort_order: 0,
  });

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
      {stack && <input type="hidden" name="id" value={stack.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Frontend"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="icon">Icon key</Label>
          <Input
            id="icon"
            name="icon"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="LayoutDashboard, Cpu, Database..."
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          rows={2}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="Next.js, Tailwind CSS, Framer Motion"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="cyan, teal, blue..."
          />
        </div>
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
      </div>

      <p className="text-xs text-slate-500">
        Icons: LayoutDashboard, Cpu, Code2, Database, Server, Globe, Palette, GitBranch, Terminal, Rocket, Shield, plus lucide icon names.
      </p>

      {state?.error && <p className="text-sm text-red-400">{String(state.error)}</p>}

      <SubmitButton variant="primary" size="sm" className="w-full" pendingLabel="Saving...">
        {stack ? "Update stack" : "Add stack"}
      </SubmitButton>
    </form>
  );
}

export function StackDeleteButton({ stack }: { stack: PublicStack }) {
  const router = useRouter();
  return (
    <ConfirmDialog
      title={`Delete "${stack.title}"?`}
      description="Nama stack akan dihapus permanen dan tidak bisa dikembalikan."
      confirmLabel="Delete"
      successMessage="Stack deleted"
      trigger={
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
          Delete
        </Button>
      }
      onConfirm={async () => {
        const fd = new FormData();
        fd.append("id", stack.id);
        const result = await deleteStackAction(null, fd);
        router.refresh();
        return result;
      }}
    />
  );
}

export function StackItem({ stack }: { stack: PublicStack }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{stack.title}</p>
          <p className="truncate text-sm text-slate-400">{stack.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </Button>
          <StackDeleteButton stack={stack} />
        </div>
      </div>
      {editing && <StackForm stack={stack} />}
    </div>
  );
}
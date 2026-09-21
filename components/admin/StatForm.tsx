"use client";

import { useState } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  createStatAction,
  updateStatAction,
  deleteStatAction,
} from "@/lib/actions/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { useActionToast } from "@/components/admin/useActionToast";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { PublicStat } from "@/types/content";

export function StatForm({ stat }: { stat?: PublicStat }) {
  const [state, formAction] = useActionState(
    stat ? updateStatAction : createStatAction,
    null
  );
  useActionToast(state, { success: stat ? "Stat updated" : "Stat added" });
  const [form, setForm] = useState({
    label: stat?.label ?? "",
    subLabel: stat?.subLabel ?? "",
    icon: stat?.icon ?? "Code2",
    color: stat?.color ?? "",
    background: stat?.background ?? "",
    sortOrder: 0,
  });

  const set = (key: keyof typeof form, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-4">
      {stat && <input type="hidden" name="id" value={stat.id} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="label">Label</Label>
          <Input
            id="label"
            name="label"
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Clean Code"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sub_label">Sub label</Label>
          <Input
            id="sub_label"
            name="sub_label"
            value={form.subLabel}
            onChange={(e) => set("subLabel", e.target.value)}
            placeholder="Next.js & React Expert"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="icon">Icon key</Label>
          <Input
            id="icon"
            name="icon"
            value={form.icon}
            onChange={(e) => set("icon", e.target.value)}
            placeholder="Code2, Zap, Trophy..."
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Sort order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="color">Color class</Label>
          <Input
            id="color"
            name="color"
            value={form.color}
            onChange={(e) => set("color", e.target.value)}
            placeholder="text-blue-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="background">Background class</Label>
          <Input
            id="background"
            name="background"
            value={form.background}
            onChange={(e) => set("background", e.target.value)}
            placeholder="bg-blue-500/10"
          />
        </div>
      </div>

      {state?.error && <p className="text-sm text-red-400">{String(state.error)}</p>}

      <Button type="submit" variant="primary" size="sm" className="w-full">
        {stat ? "Update stat" : "Add stat"}
      </Button>
    </form>
  );
}

export function StatDeleteButton({ stat }: { stat: PublicStat }) {
  const router = useRouter();
  return (
    <ConfirmDialog
      title={`Delete "${stat.label}"?`}
      description="Stat akan dihapus permanen dan tidak bisa dikembalikan."
      confirmLabel="Delete"
      successMessage="Stat deleted"
      trigger={
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
          Delete
        </Button>
      }
      onConfirm={async () => {
        const fd = new FormData();
        fd.append("id", stat.id);
        const result = await deleteStatAction(null, fd);
        router.refresh();
        return result;
      }}
    />
  );
}

export function StatItem({ stat }: { stat: PublicStat }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{stat.label}</p>
          <p className="truncate text-sm text-slate-400">{stat.subLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </Button>
          <StatDeleteButton stat={stat} />
        </div>
      </div>
      {editing && <StatForm stat={stat} />}
    </div>
  );
}
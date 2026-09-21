"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  createSocialAction,
  updateSocialAction,
  deleteSocialAction,
} from "@/lib/actions/content";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { SubmitButton } from "@/components/admin/SubmitButton";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import type { PublicSocial } from "@/types/content";

export function SocialForm({ social }: { social?: PublicSocial }) {
  const [form, setForm] = useState({
    name: social?.name ?? "",
    href: social?.href ?? "",
    icon: social?.icon ?? "Github",
  });

  const action = social ? updateSocialAction : createSocialAction;

  return (
    <form
      action={async (fd: FormData) => {
        const result = await action(null, fd);
        if (result?.error) toast.error(result.error);
        else toast.success(social ? "Social link updated" : "Social link added");
      }}
      className="space-y-3 rounded-xl border border-white/10 bg-slate-900/50 p-4"
    >
      {social && <input type="hidden" name="id" value={social.id} />}

      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          placeholder="GitHub"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="href">URL</Label>
        <Input
          id="href"
          name="href"
          value={form.href}
          onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))}
          placeholder="https://github.com/..."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon key</Label>
        <Input
          id="icon"
          name="icon"
          value={form.icon}
          onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
          placeholder="Github, Linkedin, Instagram, Mail..."
          required
        />
        <p className="text-xs text-slate-500">
          Keys supported by lib/icons.ts (Github, Linkedin, Instagram, plus lucide icon names).
        </p>
      </div>

      <input type="hidden" name="sort_order" value="0" />

      <SubmitButton variant="primary" size="sm" className="w-full" pendingLabel="Saving...">
        {social ? "Update" : "Add social"}
      </SubmitButton>
    </form>
  );
}

export function SocialDeleteButton({ social }: { social: PublicSocial }) {
  const router = useRouter();
  return (
    <ConfirmDialog
      title={`Delete "${social.name}"?`}
      description="Social link akan dihapus permanen dan tidak bisa dikembalikan."
      confirmLabel="Delete"
      successMessage="Social link deleted"
      trigger={
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
          Delete
        </Button>
      }
      onConfirm={async () => {
        const fd = new FormData();
        fd.append("id", social.id);
        const result = await deleteSocialAction(null, fd);
        router.refresh();
        return result;
      }}
    />
  );
}

export function SocialItem({ social }: { social: PublicSocial }) {
  const [editing, setEditing] = useState(false);
  return (
    <div className="space-y-2 rounded-xl border border-white/10 bg-slate-900/50 p-3">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium text-white">{social.name}</p>
          <p className="truncate text-sm text-slate-400">{social.href}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditing((e) => !e)}>
            {editing ? "Close" : "Edit"}
          </Button>
          <SocialDeleteButton social={social} />
        </div>
      </div>
      {editing && <SocialForm social={social} />}
    </div>
  );
}

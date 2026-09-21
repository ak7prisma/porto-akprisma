"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateHeroAction } from "@/lib/actions/content";
import { useActionToast } from "@/components/admin/useActionToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { PublicHero } from "@/types/content";

export default function HeroForm({
  hero,
  heroId,
}: {
  hero: PublicHero;
  heroId?: string;
}) {
  const [state, formAction] = useActionState(updateHeroAction, null);
  useActionToast(state, { success: "Hero updated successfully" });
  const [form, setForm] = useState({
    name: hero.name,
    role: hero.role,
    status: hero.status,
    description: hero.description,
    initial: hero.initial,
    initialBadge: hero.initialBadge,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={heroId ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input
            id="role"
            name="role"
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Input
          id="status"
          name="status"
          value={form.status}
          onChange={(e) => set("status", e.target.value)}
          required
        />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initial">Initial</Label>
          <Input
            id="initial"
            name="initial"
            value={form.initial}
            onChange={(e) => set("initial", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="initial_badge">Initial Badge</Label>
          <Input
            id="initial_badge"
            name="initial_badge"
            value={form.initialBadge}
            onChange={(e) => set("initialBadge", e.target.value)}
            required
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">
          {typeof state.error === "string" ? state.error : "Please fix the invalid fields."}
        </p>
      )}

      <SubmitButton variant="primary" size="lg" className="w-full" pendingLabel="Saving...">
        Save Hero
      </SubmitButton>
    </form>
  );
}

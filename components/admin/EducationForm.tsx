"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateEducationAction } from "@/lib/actions/content";
import { useActionToast } from "@/components/admin/useActionToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { PublicEducation } from "@/types/content";

export default function EducationForm({
  education,
  educationId,
}: {
  education: PublicEducation;
  educationId?: string;
}) {
  const [state, formAction] = useActionState(updateEducationAction, null);
  useActionToast(state, { success: "Education updated successfully" });
  const [form, setForm] = useState({
    year: education.year,
    degree: education.degree,
    university: education.university,
    description: education.description,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={educationId ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            value={form.year}
            onChange={(e) => set("year", e.target.value)}
            placeholder="2024 - Present"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            name="degree"
            value={form.degree}
            onChange={(e) => set("degree", e.target.value)}
            placeholder="Informatics - Fasilkom"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="university">University</Label>
        <Input
          id="university"
          name="university"
          value={form.university}
          onChange={(e) => set("university", e.target.value)}
          placeholder="Universitas Sriwijaya"
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

      {state?.error && (
        <p className="text-sm text-red-400">
          {typeof state.error === "string" ? state.error : "Please fix the invalid fields."}
        </p>
      )}

      <SubmitButton variant="primary" size="lg" className="w-full" pendingLabel="Saving...">
        Save Education
      </SubmitButton>
    </form>
  );
}
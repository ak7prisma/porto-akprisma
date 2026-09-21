"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateContactAction } from "@/lib/actions/content";
import { useActionToast } from "@/components/admin/useActionToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/SubmitButton";

export default function ContactSettingsForm({
  config,
  configId,
}: {
  config: {
    contactHeading: string;
    contactIntro: string;
    email: string;
    location: string;
  };
  configId?: string;
}) {
  const [state, formAction] = useActionState(updateContactAction, null);
  useActionToast(state, { success: "Contact settings saved successfully" });
  const [form, setForm] = useState({
    contactHeading: config.contactHeading,
    contactIntro: config.contactIntro,
    email: config.email,
    location: config.location,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-4 rounded-xl border border-white/10 bg-slate-900/50 p-4">
      <input type="hidden" name="id" value={configId ?? ""} />

      <div className="space-y-2">
        <Label htmlFor="contact_heading">Contact heading</Label>
        <Input
          id="contact_heading"
          name="contact_heading"
          value={form.contactHeading}
          onChange={(e) => set("contactHeading", e.target.value)}
          placeholder="Let's work together"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contact_intro">Contact intro</Label>
        <Textarea
          id="contact_intro"
          name="contact_intro"
          rows={3}
          value={form.contactIntro}
          onChange={(e) => set("contactIntro", e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Contact email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={form.location}
            onChange={(e) => set("location", e.target.value)}
            required
          />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">
          {typeof state.error === "string" ? state.error : "Please fix the invalid fields."}
        </p>
      )}

      <SubmitButton variant="primary" size="sm" className="w-full" pendingLabel="Saving...">
        Save Contact
      </SubmitButton>
    </form>
  );
}
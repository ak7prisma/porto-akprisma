"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateSiteConfigAction } from "@/lib/actions/content";
import { useActionToast } from "@/components/admin/useActionToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/admin/SubmitButton";
import type { PublicSiteConfig } from "@/types/content";

export default function SiteConfigForm({
  config,
  configId,
}: {
  config: PublicSiteConfig;
  configId?: string;
}) {
  const [state, formAction] = useActionState(updateSiteConfigAction, null);
  useActionToast(state, { success: "Site config saved successfully" });
  const [form, setForm] = useState({
    siteName: config.siteName,
    tagline: config.tagline,
    email: config.email,
    location: config.location,
    cvLink: config.cvLink ?? "",
    footerText: config.footerText,
  });

  const set = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={configId ?? ""} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="site_name">Site Name</Label>
          <Input
            id="site_name"
            name="site_name"
            value={form.siteName}
            onChange={(e) => set("siteName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="site_tagline">Tagline</Label>
          <Input
            id="site_tagline"
            name="site_tagline"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="cv_link">CV Link</Label>
        <Input
          id="cv_link"
          name="cv_link"
          type="url"
          value={form.cvLink}
          onChange={(e) => set("cvLink", e.target.value)}
          placeholder="https://... (leave empty to hide)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="footer_text">Footer Text</Label>
        <Textarea
          id="footer_text"
          name="footer_text"
          rows={3}
          value={form.footerText}
          onChange={(e) => set("footerText", e.target.value)}
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">
          {typeof state.error === "string" ? state.error : "Please fix the invalid fields."}
        </p>
      )}

      <SubmitButton variant="primary" size="lg" className="w-full" pendingLabel="Saving...">
        Save Site Config
      </SubmitButton>
    </form>
  );
}

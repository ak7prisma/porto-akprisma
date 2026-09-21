"use client";

import { useState } from "react";
import { useActionState } from "react";
import { updateAboutAction } from "@/lib/actions/content";
import { useActionToast } from "@/components/admin/useActionToast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/Button";
import type { PublicAbout } from "@/types/content";

export default function AboutForm({
  about,
  aboutId,
}: {
  about: PublicAbout;
  aboutId?: string;
}) {
  const [state, formAction] = useActionState(updateAboutAction, null);
  useActionToast(state, { success: "About updated successfully" });
  const [headline, setHeadline] = useState(about.headline);
  const [bios, setBios] = useState<string[]>(about.bios.map((b) => b.content));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={aboutId ?? ""} />
      <input type="hidden" name="bios" value={JSON.stringify(bios.map((content) => ({ content })))} />

      <div className="space-y-2">
        <Label htmlFor="headline">Headline</Label>
        <Input
          id="headline"
          name="headline"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Bio paragraphs</Label>
        {bios.map((bio, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={bio}
              onChange={(e) =>
                setBios((prev) => prev.map((b, j) => (j === i ? e.target.value : b)))
              }
              rows={3}
              placeholder={`Paragraph ${i + 1}`}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setBios((prev) => prev.filter((_, j) => j !== i))}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setBios((prev) => [...prev, ""])}
        >
          Add paragraph
        </Button>
      </div>

      {state?.error && (
        <p className="text-sm text-red-400">
          {typeof state.error === "string" ? state.error : "Please fix the invalid fields."}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full">
        Save About
      </Button>
    </form>
  );
}

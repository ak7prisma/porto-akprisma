"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import type { ActionState } from "@/lib/actions/content";

const projectSchema = z.object({
  id: z.coerce.number().int().optional(),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(1),
  tech: z.string().default(""),
  desktop_image: z.string().default(""),
  mobile_image: z.string().default(""),
  demo_url: z.string().default(""),
  github_url: z.string().default(""),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_published: z
    .union([z.literal("on"), z.literal("true"), z.boolean()])
    .optional()
    .transform((v) => v === "on" || v === "true" || v === true),
});

export async function saveProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = projectSchema.safeParse({
    id: formData.get("id") ? Number(formData.get("id")) : undefined,
    title: formData.get("title"),
    category: formData.get("category"),
    description: formData.get("description"),
    tech: formData.get("tech"),
    desktop_image: formData.get("desktop_image"),
    mobile_image: formData.get("mobile_image"),
    demo_url: formData.get("demo_url"),
    github_url: formData.get("github_url"),
    sort_order: formData.get("sort_order") ?? 0,
    is_published: formData.get("is_published") ?? false,
  });

  if (!parsed.success) {
    return { error: "Please fill in the required fields correctly." };
  }

  const supabase = await createClient();
  const { id, ...rest } = parsed.data;

  const payload = {
    ...rest,
    tech: rest.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };

  const { error } = id
    ? await supabase.from("projects").update(payload).eq("id", id)
    : await supabase.from("projects").insert(payload);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function deleteProjectAction(id: number) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return { success: true };
}

export async function toggleProjectPublishAction(id: number, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("projects")
    .update({ is_published: isPublished })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin/projects");
  return { success: true };
}
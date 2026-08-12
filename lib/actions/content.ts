"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

export type ActionState =
  | { error: string; success?: undefined }
  | { success: boolean; error?: undefined }
  | null;

const heroSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  role: z.string().min(1),
  status: z.string().min(1),
  description: z.string().min(1),
  initial: z.string().min(1).max(10),
  initial_badge: z.string().min(1).max(10),
});

const aboutSchema = z.object({
  id: z.string().optional(),
  headline: z.string().min(1),
  bios: z.array(z.object({ content: z.string() })).default([]),
});

const siteConfigSchema = z.object({
  id: z.string().optional(),
  site_name: z.string().min(1),
  site_tagline: z.string(),
  email: z.string().email(),
  location: z.string().min(1),
  cv_link: z.union([z.string().url(), z.literal("")]),
  footer_text: z.string(),
});

const socialSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  href: z.string().url(),
  icon: z.string().min(1),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export async function updateHeroAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = heroSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    role: formData.get("role"),
    status: formData.get("status"),
    description: formData.get("description"),
    initial: formData.get("initial"),
    initial_badge: formData.get("initial_badge"),
  });

  if (!parsed.success) return { error: "Please fill in the required fields correctly." };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;

  const { error } = id
    ? await supabase.from("hero").update(payload).eq("id", id)
    : await supabase.from("hero").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateAboutAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const biosRaw = formData.get("bios");
  let bios: { content: string }[] = [];
  if (typeof biosRaw === "string" && biosRaw.trim()) {
    try {
      bios = JSON.parse(biosRaw);
    } catch {
      bios = [];
    }
  }

  const parsed = aboutSchema.safeParse({
    id: formData.get("id") || undefined,
    headline: formData.get("headline"),
    bios,
  });

  if (!parsed.success) return { error: "Please fill in the required fields correctly." };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;

  let aboutId = id;
  if (id) {
    const { error: aboutError } = await supabase
      .from("about")
      .update({ headline: payload.headline })
      .eq("id", id);
    if (aboutError) return { error: aboutError.message };
  } else {
    const { data: created, error: aboutError } = await supabase
      .from("about")
      .insert({ headline: payload.headline })
      .select("id")
      .single();
    if (aboutError) return { error: aboutError.message };
    aboutId = created?.id;
  }

  if (aboutId) {
    await supabase.from("about_bios").delete().eq("about_id", aboutId);
    const { error: biosError } = await supabase.from("about_bios").insert(
      payload.bios
        .filter((b) => b.content.trim())
        .map((b, i) => ({
          about_id: aboutId,
          content: b.content,
          sort_order: i,
        }))
    );
    if (biosError) return { error: biosError.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateSiteConfigAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = siteConfigSchema.safeParse({
    id: formData.get("id") || undefined,
    site_name: formData.get("site_name"),
    site_tagline: formData.get("site_tagline"),
    email: formData.get("email"),
    location: formData.get("location"),
    cv_link: formData.get("cv_link") ?? "",
    footer_text: formData.get("footer_text"),
  });

  if (!parsed.success) return { error: "Please fix the invalid fields (check the CV link URL)." };

  const supabase = await createClient();
  const { id, cv_link, ...rest } = parsed.data;
  const payload = { ...rest, cv_link: cv_link || null };

  const { error } = id
    ? await supabase.from("site_config").update(payload).eq("id", id)
    : await supabase.from("site_config").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function createSocialAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = socialSchema.safeParse({
    name: formData.get("name"),
    href: formData.get("href"),
    icon: formData.get("icon"),
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success) return { error: "Invalid social link data." };

  const supabase = await createClient();
  const payload = {
    name: parsed.data.name,
    href: parsed.data.href,
    icon: parsed.data.icon,
    sort_order: parsed.data.sort_order,
  };
  const { error } = await supabase.from("socials").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/socials");
  return { success: true };
}

export async function updateSocialAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = socialSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    href: formData.get("href"),
    icon: formData.get("icon"),
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success || !parsed.data.id) return { error: "Invalid data" };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;
  const { error } = await supabase.from("socials").update(payload).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/socials");
  return { success: true };
}

export async function deleteSocialAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return { error: "Missing id" };

  const supabase = await createClient();
  const { error } = await supabase.from("socials").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/socials");
  return { success: true };
}

export async function updateContactMessageStatusAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id");
  const status = formData.get("status");

  if (!id || typeof id !== "string" || !status || typeof status !== "string") {
    return { error: "Invalid data" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return { success: true };
}

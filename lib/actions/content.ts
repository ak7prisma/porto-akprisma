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

const contactSchema = z.object({
  id: z.string().optional(),
  contact_heading: z.string().min(1),
  contact_intro: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
});

export async function updateContactAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    id: formData.get("id") || undefined,
    contact_heading: formData.get("contact_heading"),
    contact_intro: formData.get("contact_intro"),
    email: formData.get("email"),
    location: formData.get("location"),
  });

  if (!parsed.success) return { error: "Please fill in the required fields correctly." };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;

  let rowId = id;
  if (!rowId) {
    const { data: existing, error: findError } = await supabase
      .from("site_config")
      .select("id")
      .limit(1)
      .maybeSingle();
    if (findError) return { error: findError.message };
    rowId = existing?.id;
  }

  if (rowId) {
    const { error } = await supabase.from("site_config").update(payload).eq("id", rowId);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("site_config").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}

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

const educationSchema = z.object({
  id: z.string().optional(),
  year: z.string().min(1),
  degree: z.string().min(1),
  university: z.string().min(1),
  description: z.string().min(1),
});

const stackSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().default(""),
  sort_order: z.coerce.number().int().min(0).default(0),
});

const statSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1),
  sub_label: z.string().min(1),
  icon: z.string().min(1),
  color: z.string().default(""),
  background: z.string().default(""),
  sort_order: z.coerce.number().int().min(0).default(0),
});

export async function updateEducationAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = educationSchema.safeParse({
    id: formData.get("id") || undefined,
    year: formData.get("year"),
    degree: formData.get("degree"),
    university: formData.get("university"),
    description: formData.get("description"),
  });

  if (!parsed.success) return { error: "Please fill in the required fields correctly." };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;

  const { error } = id
    ? await supabase.from("education").update(payload).eq("id", id)
    : await supabase.from("education").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { success: true };
}

export async function createStackAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = stackSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    color: formData.get("color") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success) return { error: "Invalid stack data." };

  const supabase = await createClient();
  const payload = {
    title: parsed.data.title,
    description: parsed.data.description,
    icon: parsed.data.icon,
    color: parsed.data.color,
    sort_order: parsed.data.sort_order,
  };
  const { error } = await supabase.from("stacks").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stacks");
  return { success: true };
}

export async function updateStackAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = stackSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    icon: formData.get("icon"),
    color: formData.get("color") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success || !parsed.data.id) return { error: "Invalid data" };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;
  const { error } = await supabase.from("stacks").update(payload).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stacks");
  return { success: true };
}

export async function deleteStackAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return { error: "Missing id" };

  const supabase = await createClient();
  const { error } = await supabase.from("stacks").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stacks");
  return { success: true };
}

export async function createStatAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = statSchema.safeParse({
    label: formData.get("label"),
    sub_label: formData.get("sub_label"),
    icon: formData.get("icon"),
    color: formData.get("color") ?? "",
    background: formData.get("background") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success) return { error: "Invalid stat data." };

  const supabase = await createClient();
  const payload = {
    label: parsed.data.label,
    sub_label: parsed.data.sub_label,
    icon: parsed.data.icon,
    color: parsed.data.color,
    background: parsed.data.background,
    sort_order: parsed.data.sort_order,
  };
  const { error } = await supabase.from("stats").insert(payload);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stats");
  return { success: true };
}

export async function updateStatAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = statSchema.safeParse({
    id: formData.get("id"),
    label: formData.get("label"),
    sub_label: formData.get("sub_label"),
    icon: formData.get("icon"),
    color: formData.get("color") ?? "",
    background: formData.get("background") ?? "",
    sort_order: formData.get("sort_order") ?? 0,
  });

  if (!parsed.success || !parsed.data.id) return { error: "Invalid data" };

  const supabase = await createClient();
  const { id, ...payload } = parsed.data;
  const { error } = await supabase.from("stats").update(payload).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stats");
  return { success: true };
}

export async function deleteStatAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const id = formData.get("id");
  if (!id || typeof id !== "string") return { error: "Missing id" };

  const supabase = await createClient();
  const { error } = await supabase.from("stats").delete().eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin/stats");
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

import { z } from "zod";

export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name must be at most 80 characters"),
  email: z.string().email("Please enter a valid email address"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  category: z.string().min(1, "Category is required").max(80),
  description: z.string().min(10, "Description is too short").max(3000),
  tech: z.array(z.string().min(1)).min(1, "Add at least one tech"),
  demo_url: z.union([z.string().url().nullish(), z.literal("")]).transform((v) => v || null),
  github_url: z.union([z.string().url().nullish(), z.literal("")]).transform((v) => v || null),
  sort_order: z.coerce.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export type ProjectInput = z.infer<typeof projectSchema>;

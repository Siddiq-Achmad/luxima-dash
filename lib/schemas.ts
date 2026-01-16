import { z } from "zod";

export const memberSchema = z.object({
    email: z.string().email(),
    role: z.string(), // role_id or role name
});

export const orgSchema = z.object({
    name: z.string().min(2),
    billing_email: z.string().email().optional(),
    description: z.string().optional(),
});

export const bookingSchema = z.object({
    user_id: z.string().uuid(),
    package_id: z.string().uuid().optional(),
    event_start: z.string(), // ISO date string
    event_end: z.string(),   // ISO date string
    status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
    notes: z.string().optional(),
});

export const postSchema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    content: z.string().min(10),
    published: z.boolean().default(false),
    image_url: z.string().url().optional().or(z.literal("")), // Legacy support
    cover_image: z.string().url().optional().or(z.literal("")),
    slug: z.string().min(3),
    category_id: z.string().optional(),
    tags: z.array(z.string()).optional(),
});

export const portfolioSchema = z.object({
    image_url: z.string().url(),
    caption: z.string().min(2),
    album_name: z.string().optional(),
    alt_text: z.string().optional(),
    sort_order: z.number().int().optional(),
});

export const packageSchema = z.object({
    name: z.string().min(3),
    price: z.coerce.number().min(0),
    description: z.string().optional(),
    currency: z.string().default("IDR"),
    features: z.array(z.string()).optional(),
    inclusions: z.array(z.string()).optional(),
    exclusions: z.array(z.string()).optional(),
    duration_hours: z.number().optional(),
    max_guests: z.number().optional(),
});

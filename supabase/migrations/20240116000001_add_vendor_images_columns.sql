-- Add missing columns to vendor_images
ALTER TABLE "public"."vendor_images" 
ADD COLUMN IF NOT EXISTS "caption" text,
ADD COLUMN IF NOT EXISTS "album_name" text;

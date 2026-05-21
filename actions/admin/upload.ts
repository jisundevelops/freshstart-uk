"use server";

import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { requireWriteAccess } from "@/actions/admin/guard";
import { toActionResult, ValidationError } from "@/lib/errors";

/** Maximum base64 file size: 10 MB */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** Data URI pattern for base64 images */
const DATA_URI_REGEX = /^data:image\/(png|jpeg|jpg|gif|webp|svg\+xml);base64,/;

const uploadSchema = z.object({
  file: z.string().min(1).max(MAX_FILE_SIZE),
  folder: z.enum(["blog", "guides", "general"]).default("general"),
});

let cloudinaryConfigured = false;

function configureCloudinary() {
  if (cloudinaryConfigured) return true;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return false;
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  cloudinaryConfigured = true;
  return true;
}

export async function uploadImage(input: {
  file: string;
  folder?: "blog" | "guides" | "general";
}) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = uploadSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.issues[0]?.message ?? "Validation failed");

    // Prevent SSRF: only allow data URIs (base64), not remote URLs
    if (!DATA_URI_REGEX.test(parsed.data.file)) {
      throw new ValidationError("Only base64 data URI uploads are supported. Remote URLs are not allowed.");
    }

    const configured = configureCloudinary();
    if (!configured) {
      throw new ValidationError(
        "Cloudinary is not configured. Set CLOUDINARY_* env variables."
      );
    }

    const result = await cloudinary.uploader.upload(parsed.data.file, {
      folder: `freshstart-uk/${parsed.data.folder}`,
      resource_type: "image",
      transformation: [{ fetch_format: "webp", quality: "auto" }],
      max_file_size: MAX_FILE_SIZE,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  });
}

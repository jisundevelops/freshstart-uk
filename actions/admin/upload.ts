"use server";

import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";
import { requireWriteAccess } from "@/actions/admin/guard";
import { toActionResult, ValidationError } from "@/lib/errors";

const uploadSchema = z.object({
  file: z.string().min(1),
  folder: z.enum(["blog", "guides", "general"]).default("general"),
});

function configureCloudinary() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret });
  return cloudinary;
}

export async function uploadImage(input: {
  file: string;
  folder?: "blog" | "guides" | "general";
}) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = uploadSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);

    const client = configureCloudinary();
    if (!client) {
      throw new ValidationError(
        "Cloudinary is not configured. Set CLOUDINARY_* env variables."
      );
    }

    const result = await client.uploader.upload(parsed.data.file, {
      folder: `freshstart-uk/${parsed.data.folder}`,
      resource_type: "image",
      transformation: [{ fetch_format: "webp", quality: "auto" }],
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    };
  });
}

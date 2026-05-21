import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8),
    newPassword: z.string().min(12),
    confirmPassword: z.string().min(12),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const siteSettingsSchema = z.object({
  siteName: z.string().min(1).max(80),
  siteDescription: z.string().min(10).max(320),
  defaultOgImage: z.string().url().optional().or(z.literal("")),
  twitterHandle: z.string().max(50).optional().or(z.literal("")),
  disclosureText: z.string().min(10).max(1000),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

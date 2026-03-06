import { z } from "zod";

export const riderSchema = z.object({
    mobile: z.string().regex(/^\d{10}$/, "Mobile must be 10 digits"),
    aadhaarNumber: z.string().min(12).max(12),
    drivingLicenceNumber: z.string().min(15).max(16),
    location: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([
            z.number(),
            z.number()
        ]),
    })
});

export const imageSchema = z.object({
    originalname: z.string().min(1, "Filename required"),
    mimetype: z.string().min(1, { error: "Mimetype is required" })
        .refine((file) => file.startsWith("image/"), {
            error: "File must be an image",
            path: ["mimetype"]
        }),
    size: z.number()
        .nonnegative({ error: "File size must be non-negative" })
        .max(5 * 1024 * 1024, "Max file size is 5MB"),
    buffer: z.instanceof(Buffer)
});
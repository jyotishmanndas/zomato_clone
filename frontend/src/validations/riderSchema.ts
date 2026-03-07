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
        ])
    })
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const imageSchema = z.instanceof(File)
    .refine((f) => f.name.length > 0, "Filename required")
    .refine((f) => f.type.startsWith("image/"), "File must be an image")
    .refine((f) => f.size <= MAX_FILE_SIZE, { error: "Max file size is 5MB" });

export const createRiderSchema = riderSchema.extend({
    picture: imageSchema
})
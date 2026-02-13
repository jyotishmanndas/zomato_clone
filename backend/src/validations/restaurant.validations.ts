import { z } from "zod";

export const restaurantSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(5).optional(),
    phone: z.string().min(10).max(10),
    ownerId: z.string(),
    isOpen: z.boolean(),
    autoLocation: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([
            z.number(),
            z.number()
        ]),
        formattedAddress: z.string()
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
import z from "zod";

export const menuSchema = z.object({
    name: z.string().trim().min(3).max(60),
    description: z.string().trim().min(3).optional(),
    price: z.coerce.number().positive().max(10000),
    category: z.enum(["veg", "non-veg"]),
    isAvailable: z.boolean(),
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

export const updateMenuItemSchema = z.object({
    name: z.string().trim().min(3).max(60).optional(),
    description: z.string().trim().min(3).optional(),
    price: z.coerce.number().positive().max(10000).optional(),
    category: z.enum(["veg", "non-veg"]).optional()
})
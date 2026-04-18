import z from "zod";

export const menuSchema = z.object({
    name: z.string().trim().min(3).max(60),
    description: z.string().trim().min(3).optional(),
    price: z.coerce.number().positive().max(10000),
    category: z.enum(["veg", "non-veg"]),
    isAvailable: z.boolean(),
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const imageSchema = z.instanceof(File)
    .refine((f) => f.name.length > 0, "Filename required")
    .refine((f) => f.type.startsWith("image/"), "File must be an image")
    .refine((f) => f.size <= MAX_FILE_SIZE, { error: "Max file size is 5MB" });

export const createMenuSchema = menuSchema.extend({
    image: imageSchema
})
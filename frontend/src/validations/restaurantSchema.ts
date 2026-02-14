import { z } from "zod";

export const restaurantSchema = z.object({
    name: z.string().min(3),
    description: z.string().min(5).optional(),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    autoLocation: z.object({
        type: z.literal("Point"),
        coordinates: z.tuple([
            z.number(),
            z.number()
        ]),
        formattedAddress: z.string()
    })
});

const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const imageSchema = z.instanceof(File)
    .refine((f) => f.name.length > 0, "Filename required")
    .refine((f) => f.type.startsWith("image/"), "File must be an image")
    .refine((f) => f.size <= MAX_FILE_SIZE, { error: "Max file size is 5MB" });


export const createRestaurantSchema = restaurantSchema.extend({
    image: imageSchema
})